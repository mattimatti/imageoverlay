# imgoverlay
Simple command line utility to apply watermarks on images


# Installing


On Windows:

Install all the required tools and configurations using Microsoft's windows-build-tools using 

```shell
npm install --global --production windows-build-tools 
```

from an elevated PowerShell or CMD.exe (run as Administrator).


```shell
npm install -g imageoverlay
```

# Running


Recreate the following struvture in your working directory:


- todo
- sample
- done
- watermark.png

where watermark.png will be the imege to overlay


then execute command:

```shell
imageoverlay [debug] [wipe]
```



#### TODO

in this folder you will place folders with unique name

- todo
      - newjobfolder
                     - originalfile.xxx
- sample
- done


#### DONE

in this folder you will find processed job folders

- todo
- sample
- done
      - processedjobfolder
                           - result.xxx
                           - originalfile.xxx


#### SAMPLE

optional folder used in debug that should contain a reference image

- todo
- sample
         - someimage.xxx (jpg,jpg,gif,png)
- done
