
Since Sencha ExtJS 6.5 Modern didn't provide a timepickerfield/timefield, so I wrote one.

## Screenshots

![12-Hour](https://github.com/lovelyelfpop/ExtJS6_5-Modern-TimePicker/raw/master/screenshots/ampm.png)

![24-Hour](https://github.com/lovelyelfpop/ExtJS6_5-Modern-TimePicker/raw/master/screenshots/mode24.png)

![TimePicker for Phone](https://github.com/lovelyelfpop/ExtJS6_5-Modern-TimePicker/raw/master/screenshots/phone.png)


## Download the Ext JS Framework

If you have not already done so, download and unpack the Ext JS framework from either the Products section 
of the main Sencha website [sencha.com](www.sencha.com) or from the downloads section of the Sencha Support portal. 

## Add Framework to your App

Once you have your application where you want it, "cd" into its directory in your Command Line Interface (CLI).  Then, 
issue the following command:

	sencha app install --framework=/path/to/extjs/

This command will wrap your app code folder with a Sencha Cmd framework that allows your application to benefit 
from Cmd's many features.

## Launch The Application

Run this command so that Cmd will generate a web server for you:

	sencha app watch

You can now visit the resulting address displayed in your console.  It will usually be found here:

  	http://localhost:1841

## Note

With Sencha Cmd 6.5 you can write code using ES6+, this application project uses ES6. 

If you want to use this component in your none-ES6+ projects, you should translate it to ES5.

If you want your none-ES6+ projects to use ES6+, you can enable transpiler in `app.json` as below:

```
    "language": {
        "js": {
            "input": "ES6",
            "output": "ES5"
        }
    },
```

For more details, please refer to ![Announcing Ext JS 6.5.2 and Sencha Cmd 6.5.2 GA](https://www.sencha.com/blog/announcing-ext-js-6-5-2-sencha-cmd-6-5-2-ga/)
