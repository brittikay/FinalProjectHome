# Full Stack Mobile App

This project consists of a Django backend and React Native/Expo frontend.

## Backend Setup (Django)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
.\venv\Scripts\activate  # On Windows
source venv/bin/activate  # On macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create Django project:
```bash
django-admin startproject config .
python manage.py startapp api
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Start the development server:
```bash
python manage.py runserver
```

## Frontend Setup (React Native/Expo)

1. Install Expo CLI globally:
```bash
npm install -g expo-cli
```

2. Create a new Expo project:
```bash
npx create-expo-app frontend
cd frontend
```

3. Install dependencies:
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install axios
```

4. Start the development server:
```bash
npx expo start
```

## Project Structure

```
.
├── backend/               # Django backend
│   ├── config/           # Django project settings
│   ├── api/              # Django app for API endpoints
│   └── requirements.txt  # Python dependencies
└── frontend/             # React Native/Expo frontend
    ├── src/              # Source code
    ├── assets/           # Static assets
    └── App.js            # Main application file
``` 