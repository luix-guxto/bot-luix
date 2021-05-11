#!/usr/bin/bash
clear
rm -r ./lib 
cp -r /storage/emulated/0/meubot/lib ./
rm ./index.js 
cp /storage/emulated/0/meubot/index.js ./
meupau=0

   while  [ $meupau -ne 110 ];
     do
           clear
           toilet -f big "Carregando $meupau%" -F gay | lolcat
           sleep 0.3;
           ((meupau=$meupau+10))
    done
    
clear
toilet -f big 'bash bot.sh' -F gay | lolcat