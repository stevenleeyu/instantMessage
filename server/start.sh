#/usr/bash

count=`lsof -i :88|wc -l`

echo $count
if [ $count -lt 1 ]; then
	cd `dirname $0`
	pwd
        /usr/bin/node app.js >> myLog.log 2>&1 &
        DATETIME=$(date +%Y%m%d%H%M%S)
	echo "$DATETIME nodeserver reboot" >> ./reboot.log
fi
