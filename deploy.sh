cd /home/debian/gamein-backend

echo "Pulling" 

git pull

echo "Pull success"

echo "Stopping..."

forever stop index.js

echo "Restarting..."

forever start index.js