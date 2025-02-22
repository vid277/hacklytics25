import os

output_dir = '/app/output'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for i in range(5):
    with open(f"{output_dir}/file_{i}.txt", "w") as f:
        f.write(f"This is file {i}\n")

print("Test script executed successfully. Files have been created.")
