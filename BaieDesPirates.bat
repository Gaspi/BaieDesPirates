set "server=%CD%"
REM set "server=%CD%\BaieDesPirates"

set "init=%CD%"
cd %server%

python server.py

cd %init%