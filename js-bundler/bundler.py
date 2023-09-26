import os

# List all .js files in the source directory
js_files = [f for f in os.listdir('./src') if f.endswith('.js')]

# Sort the files alphabetically to ensure consistent order
js_files.sort()

# Removes source mapping from JS files
def removeSourceMapping(string):
    lines = string.splitlines()
    lines_filtered = [line for line in lines if not line.startswith("//# sourceMappingURL=")]
    return '\n'.join(lines_filtered)

# Combine and the files
with open('./jsbundle.min.js', 'w') as outfile:
    for js_file in js_files:
        file_path = os.path.join('./src', js_file)
        
        with open(file_path, 'r') as infile:
            content = infile.read()
            outfile.write(removeSourceMapping(content));
            outfile.write('\n\n')

print(f'Combined {len(js_files)} JavaScript files into jsbundle.min.js')