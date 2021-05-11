#!/bin/bash
index=1
contador=1
while [ $index -ne 2 ];
do 
      clear
      toilet -f big "Iniciando o bot pela $contador Vez" -F gay | lolcat
      node ./index.js
      sleep 1;
      ((contador=$contador+1))
done