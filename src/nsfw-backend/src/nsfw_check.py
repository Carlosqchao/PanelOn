import sys
import os
from nudenet import NudeDetector

image_dir = sys.argv[1]
pegi = sys.argv[2]
classifier = NudeDetector()
files = [os.path.join(image_dir,f) for f in os.listdir(image_dir) if f.endswith('.jpg') or f.endswith('.jpeg') or f.endswith('.png')]
result = classifier.detect_batch(files)

nsfw_found = False
safe_labels_by_pegi = {
  "3": ['FACE_FEMALE','FACE_MALE','ARMPITS_COVERED'],
  "7": ['FACE_FEMALE','FACE_MALE','ARMPITS_COVERED','BELLY_EXPOSED'],
  "12": ['FACE_FEMALE','FACE_MALE','ARMPITS_COVERED','BELLY_EXPOSED','FEET_COVERED'],
  "16": ['FACE_FEMALE','FACE_MALE','ARMPITS_COVERED','BELLY_EXPOSED','FEET_COVERED','BUTTOCKS_COVERED'],
  "18": ['FEMALE_GENITALIA_COVERED',
    'FACE_FEMALE',
    'BUTTOCKS_EXPOSED',
    'MALE_BREAST_EXPOSED',
    'FEET_EXPOSED',
    'BELLY_COVERED',
    'FEET_COVERED',
    'ARMPITS_COVERED',
    'ARMPITS_EXPOSED',
    'FACE_MALE',
    'BELLY_EXPOSED',
    'ANUS_COVERED',
    'FEMALE_BREAST_COVERED',
    'BUTTOCKS_COVERED',
  ]
}

safe_labels = safe_labels_by_pegi.get(pegi, [])

for image_result in result:
  for detection in image_result:
    label = detection['class']
    if label not in safe_labels:
      nsfw_found = True
      break
  if nsfw_found:
    break

if not nsfw_found:
  print("CLEAN")
else:
  print("NSFW")


for archivo in os.listdir(image_dir):
  archivo_path = os.path.join(image_dir, archivo)
  os.remove(archivo_path)
  #print(f"El archivo o directorio {archivo_path} ha sido eliminado.")
