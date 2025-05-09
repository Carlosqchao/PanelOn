import sys
import os
import json
from PIL import Image, ImageDraw, ImageFont
from nudenet import NudeDetector
from ultralytics import YOLO

image_dir = sys.argv[1]

uploads_dir = os.path.abspath(os.path.join(image_dir, '../uploads'))
preview_dir = os.path.abspath(os.path.join(image_dir, '../preview'))
os.makedirs(uploads_dir, exist_ok=True)
os.makedirs(preview_dir, exist_ok=True)

for f in os.listdir(uploads_dir):
  os.remove(os.path.join(uploads_dir, f))

nsfw_detector = NudeDetector()
violence_model = YOLO('src/nsfw-backend/models/yolo_small_weights.pt')
safe_labels_by_pegi = {
  "3": ['FACE_FEMALE', 'FACE_MALE', 'ARMPITS_COVERED'],
  "7": ['FACE_FEMALE', 'FACE_MALE', 'ARMPITS_COVERED', 'BELLY_EXPOSED'],
  "12": ['FACE_FEMALE', 'FACE_MALE', 'ARMPITS_COVERED', 'BELLY_EXPOSED', 'FEET_COVERED'],
  "16": ['FACE_FEMALE', 'FACE_MALE', 'ARMPITS_COVERED', 'BELLY_EXPOSED', 'FEET_COVERED',
         'BUTTOCKS_COVERED', 'FEMALE_BREAST_COVERED'],
  "18": ['FEMALE_GENITALIA_COVERED', 'FACE_FEMALE', 'BUTTOCKS_EXPOSED', 'MALE_BREAST_EXPOSED',
         'FEET_EXPOSED', 'BELLY_COVERED', 'FEET_COVERED', 'ARMPITS_COVERED', 'ARMPITS_EXPOSED',
         'FACE_MALE', 'BELLY_EXPOSED', 'ANUS_COVERED', 'BUTTOCKS_COVERED', 'FEMALE_BREAST_COVERED']
}
all_safe_labels = set(safe_labels_by_pegi["18"])

color_map = {
  'FACE_FEMALE': 'blue',
  'FACE_MALE': 'green',
  'ARMPITS_COVERED': 'yellow',
  'BELLY_EXPOSED': 'orange',
  'FEET_COVERED': 'purple',
  'BUTTOCKS_COVERED': 'pink',
  'FEMALE_BREAST_COVERED': 'red',
  'FEMALE_GENITALIA_COVERED': 'cyan',
  'BUTTOCKS_EXPOSED': 'brown',
  'MALE_BREAST_EXPOSED': 'gray',
  'FEET_EXPOSED': 'teal',
  'ANUS_COVERED': 'lime',
  'ARMPITS_EXPOSED': 'violet',
  'BELLY_COVERED': 'magenta',
}

def calcular_pegi(detected_labels):
  for pegi_level in ["3", "7", "12", "16", "18"]:
    if detected_labels.issubset(set(safe_labels_by_pegi[pegi_level])):
      return pegi_level
  return "18"

def detect_violence_yolov8(image_path):
  results = violence_model(image_path)
  for result in results:
    for cls in result.boxes.cls:
      class_name = violence_model.names[int(cls)]
      if class_name.lower() in ['fight', 'violence']:
        return True
  return False

files = [os.path.join(image_dir, f) for f in os.listdir(image_dir)
         if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

nsfw_found = False
violence_found = False
detected_labels = set()
first_image_saved = False

result = nsfw_detector.detect_batch(files)

for image_result, image_path in zip(result, files):
  image = Image.open(image_path)
  draw = ImageDraw.Draw(image)
  image_detected_labels = set()

  for detection in image_result:
    image_detected_labels.add(detection['class'])
    box = detection['box']
    x0, y0, width, height = box
    color = color_map.get(detection['class'], 'red')

    draw.rectangle([x0, y0, x0 + width, y0 + height], outline=color, width=5)
    try:
      font = ImageFont.truetype("arial.ttf", 20)
    except:
      font = ImageFont.load_default()
    draw.text((x0, y0 - 20), detection['class'], fill=color, font=font)

  detected_labels.update(image_detected_labels)

  if any(label not in all_safe_labels for label in image_detected_labels):
    nsfw_found = True
    image.save(os.path.join(uploads_dir, os.path.basename(image_path)))

  if not first_image_saved:
    image.save(os.path.join(preview_dir, 'preview.jpg'))
    first_image_saved = True

if not nsfw_found:
  for image_path in files:
    if detect_violence_yolov8(image_path):
      violence_found = True
      image = Image.open(image_path)
      image.save(os.path.join(uploads_dir, os.path.basename(image_path)))
      break

for f in files:
  os.remove(f)

pegi_result = "18"
if not nsfw_found and not violence_found:
  pegi_result = calcular_pegi(detected_labels)
elif violence_found:
  pegi_result = "16"

if nsfw_found:
  print(json.dumps({"nsfw": True}))
elif violence_found:
  print(json.dumps({"violence": True, "pegi": pegi_result}))
else:
  print(json.dumps({"nsfw": False, "pegi": pegi_result}))
