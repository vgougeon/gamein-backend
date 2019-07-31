cd /home/debian/gamein-backend

echo "Pulling" 

git pull

echo "Pull success"

echo "Restarting..."

forever restart index.js