import sys
import os
from nudenet import NudeDetector

image_dir = sys.argv[1]
classifier = NudeDetector()
files = [os.path.join(image_dir,f) for f in os.listdir(image_dir) if f.endswith('.jpg') or f.endswith('.jpeg') or f.endswith('.png')]
result = classifier.detect_batch(files)
print(result)

nsfw_found = False

for image_result in result:
  for detection in image_result:
    label = detection['class']
    if label not in ['FACE_FEMALE', 'FACE_MALE']:
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
  print(f"El archivo o directorio {archivo_path} ha sido eliminado.")
