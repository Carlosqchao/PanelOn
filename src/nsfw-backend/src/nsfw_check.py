import shutil
import sys
import os
from nudenet import NudeDetector

image_dir = sys.argv[1]
classifier = NudeDetector()
files = [os.path.join(image_dir,f) for f in os.listdir(image_dir) if f.endswith('.jpg') or f.endswith('.jpeg') or f.endswith('.png')]
result = classifier.detect_batch(files)
print(result)
if not any(result):
  print("CLEAN")
else:
  print("NSFW")

for archivo in os.listdir(image_dir):
  archivo_path = os.path.join(image_dir, archivo)
  os.remove(archivo_path)  # Eliminar archivos
  print(f"El archivo o directorio {archivo_path} ha sido eliminado.")
