#/usr/bash

DATE=$(date +%Y%m%d)
cd `dirname $0`
cat myLog.log > ./rotateLog/nodeLog_$DATE.log && echo "">myLog.log
