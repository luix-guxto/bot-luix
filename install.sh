#!/usr/bin/bash

apt-get update
apt-get upgrade
pkg install figlet
apt-get install nodejs
apt-get install libwebp
apt-get install mc
apt-get install ffmpeg
apt-get install wget
apt-get install tesseract
wget -O ~/../usr/share/tessdata/ind.traineddata "https://github.com/tesseract-ocr/tessdata/blob/master/ind.traineddata?raw=true"
npm install

toilet -f big "todas as dependencias foram instaladas digite bash bot.sh para iniciar o bot!!!" -F gay | lolcat
echo  "todas as dependencias foram instaladas digite bash bot.sh para iniciar o bot!!!"