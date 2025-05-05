import json
import sys
import os
from nudenet import NudeDetector

image_dir = sys.argv[1]
classifier = NudeDetector()
files = [os.path.join(image_dir,f) for f in os.listdir(image_dir) if f.endswith('.jpg') or f.endswith('.jpeg') or f.endswith('.png')]
result = classifier.detect_batch(files)

safe_labels_by_pegi = {
  "3": ['FACE_FEMALE','FACE_MALE','ARMPITS_COVERED'],
  "7": ['FACE_FEMALE','FACE_MALE','ARMPITS_COVERED','BELLY_EXPOSED'],
  "12": ['FACE_FEMALE','FACE_MALE','ARMPITS_COVERED','BELLY_EXPOSED','FEET_COVERED'],
  "16": ['FACE_FEMALE','FACE_MALE','ARMPITS_COVERED','BELLY_EXPOSED','FEET_COVERED','BUTTOCKS_COVERED','FEMALE_BREAST_COVERED'],
  "18": [
    'FEMALE_GENITALIA_COVERED', 'FACE_FEMALE', 'BUTTOCKS_EXPOSED', 'MALE_BREAST_EXPOSED',
    'FEET_EXPOSED', 'BELLY_COVERED', 'FEET_COVERED', 'ARMPITS_COVERED', 'ARMPITS_EXPOSED',
    'FACE_MALE', 'BELLY_EXPOSED', 'ANUS_COVERED', 'BUTTOCKS_COVERED','FEMALE_BREAST_COVERED'
  ]
}

all_safe_labels = set(safe_labels_by_pegi["18"])

detected_labels = set()
for image_result in result:
  for detection in image_result:
    detected_labels.add(detection['class'])

nsfw_found = any(label not in all_safe_labels for label in detected_labels)

def calcular_pegi(detected_labels):
  for pegi_level in ["3", "7", "12", "16", "18"]:
    safe_labels = set(safe_labels_by_pegi[pegi_level])
    if detected_labels.issubset(safe_labels):
      return pegi_level
  return "18"

if nsfw_found:
  print(json.dumps({"nsfw": True}))
else:
  pegi_result = calcular_pegi(detected_labels)
  print(json.dumps({"nsfw": False, "pegi": pegi_result}))

# Obtener lista de archivos ordenada
imagenes = sorted([f for f in os.listdir(image_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
if imagenes:
  imagen_a_guardar = imagenes[0]

  for archivo in imagenes[1:]:  # empieza desde la segunda
    archivo_path = os.path.join(image_dir, archivo)
    os.remove(archivo_path)

  # Opcional: renombrar la imagen para más claridad
  original_path = os.path.join(image_dir, imagen_a_guardar)
  nuevo_path = os.path.join(image_dir, 'preview.jpg')
  os.rename(original_path, nuevo_path)
