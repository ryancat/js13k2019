Optimize guides:
1. use global variables whenever possible
2. do not use dot properties
3. no string as keys for non-user-facing items -> change them to numbers in arrays
4. remove error exception 
5. put dialog in the foreground layer and remove string.js
6. use a better zip tool
7. take out webpack and use manual concat + terser


Optimize strategy:
1. Change class to factory functions
2. Use global variables which can be minified
3. Use array instead of object
4. Use fake namespace like incident_createSprite