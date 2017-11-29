which -s postgres
if [ "$?" -gt "0" ]; then
        echo "Not installed"
else
        echo "Installed"
fi

