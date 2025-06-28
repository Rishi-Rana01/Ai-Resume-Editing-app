def save_resume_to_file(resume_data, file_path):
    with open(file_path, 'w') as file:
        file.write(resume_data)

def load_resume_from_file(file_path):
    with open(file_path, 'r') as file:
        return file.read()