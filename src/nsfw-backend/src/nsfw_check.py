import sys
from PIL import Image, ImageDraw, ImageFont
import os
import json
from nudenet import NudeDetector

image_dir = sys.argv[1]
uploads_dir = os.path.abspath(os.path.join(image_dir, '../uploads'))
preview_dir = os.path.abspath(os.path.join(image_dir, '../preview'))
os.makedirs(uploads_dir, exist_ok=True)
os.makedirs(preview_dir,exist_ok=True)

uploads_files = [f for f in os.listdir(uploads_dir)]
for uploads_file in uploads_files:
  os.remove(os.path.join(uploads_dir, uploads_file))

classifier = NudeDetector()

files = [os.path.join(image_dir, f) for f in os.listdir(image_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

result = classifier.detect_batch(files)

safe_labels_by_pegi = {
  "3": ['FACE_FEMALE', 'FACE_MALE', 'ARMPITS_COVERED'],
  "7": ['FACE_FEMALE', 'FACE_MALE', 'ARMPITS_COVERED', 'BELLY_EXPOSED'],
  "12": ['FACE_FEMALE', 'FACE_MALE', 'ARMPITS_COVERED', 'BELLY_EXPOSED', 'FEET_COVERED'],
  "16": ['FACE_FEMALE', 'FACE_MALE', 'ARMPITS_COVERED', 'BELLY_EXPOSED', 'FEET_COVERED', 'BUTTOCKS_COVERED', 'FEMALE_BREAST_COVERED'],
  "18": ['FEMALE_GENITALIA_COVERED', 'FACE_FEMALE', 'BUTTOCKS_EXPOSED', 'MALE_BREAST_EXPOSED', 'FEET_EXPOSED', 'BELLY_COVERED', 'FEET_COVERED', 'ARMPITS_COVERED', 'ARMPITS_EXPOSED', 'FACE_MALE', 'BELLY_EXPOSED', 'ANUS_COVERED', 'BUTTOCKS_COVERED', 'FEMALE_BREAST_COVERED']
}

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

all_safe_labels = set(safe_labels_by_pegi["18"])

def calcular_pegi(detected_labels):
  for pegi_level in ["3", "7", "12", "16", "18"]:
    safe_labels = set(safe_labels_by_pegi[pegi_level])
    if detected_labels.issubset(safe_labels):
      return pegi_level
  return "18"

nsfw_found = False
detected_labels = set()

first_image_saved = False

for image_result, image_path in zip(result, files):
  image = Image.open(image_path)
  draw = ImageDraw.Draw(image)
  image_detected_labels = set()

  for detection in image_result:
    image_detected_labels.add(detection['class'])
    box = detection['box']
    x0, y0, width, height = box

    color = color_map.get(detection['class'], 'red')

    draw.rectangle([x0, y0, x0+width, y0+height], outline=color, width=5)
    font = ImageFont.truetype("arial.ttf", 20)

    draw.text((x0, y0 - 20), detection['class'], fill=color, font=font)


  nsfw_found = any(label not in all_safe_labels for label in image_detected_labels)

  if nsfw_found:
    filename = os.path.basename(image_path)
    marked_path = os.path.join(uploads_dir, filename)
    image.save(marked_path)

  if not first_image_saved:
    preview_filename = os.path.basename(image_path)
    preview_path = os.path.join(preview_dir, preview_filename)
    image.save(preview_path)
    first_image_saved = True

output_files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
for output_file in output_files:
  os.remove(os.path.join(image_dir, output_file))

pegi_result = "18"
if not nsfw_found:
  pegi_result = calcular_pegi(detected_labels)

if nsfw_found:
  print(json.dumps({"nsfw": True}))
else:
  print(json.dumps({"nsfw": False, "pegi": pegi_result}))
