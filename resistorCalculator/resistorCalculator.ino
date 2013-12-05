  /* modi remember this is going to be open source = no $$ :( */
 #include <Bridge.h>
 #include <SpacebrewYun.h>
  
  SpacebrewYun sb = SpacebrewYun("Resistor", "Resistor Test");
  
  int analogPin = A0;     
  int raw = 0;           
  int Vin = 4.950;           
  float Vout = 0;        
  float R = 120;         // base resistance
  float R1 = 0;          // unknown resistor
  float buffer = 0;      // buffer variable for calculation
  
  void setup(){
    Serial.begin(57600);
    Bridge.begin();
    delay(4000);
    sb.verbose(true);
    sb.addPublish("resistor value", "string");
    sb.connect("192.168.1.205");  
  }
  
  void loop(){
    sb.monitor();
    if (sb.connected()) {
      
        raw = analogRead(analogPin);    
        Vout = (5.0/1023.0)*raw;    
        buffer = (Vin/Vout)-1;
        R1 = (R/buffer) * 1000;
        
        int expo = floor(log10(R1));
        String val = String(int(R1));
        String resVal = val + "ohm";
        
        if (expo >= 1) {
          val = String(int(R1));
          resVal = val;
          sb.send("resistor value", resVal);
        
        }
        
        if(expo >= 3) {
          val = String(int(R1 / 1000));
          resVal = val + "k";
          sb.send("resistor value", resVal);
        }
        
        if(expo >= 6) {
          val = String(int(R1 / 1000000));
          resVal = val + "M";
          sb.send("resistor value", resVal);
        }
        if (raw >= 1015 ) {
          resVal = "place resistor";
          sb.send("resistor value", resVal);
        }
        delay(500);   
    }
  }
  

