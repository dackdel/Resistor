(function (exports){
    /**
     * Returns the color for a resistor band value
     * @param  {string} value resistor band value between -2 to 9
     * @return {string}       color corresponding to that value
     */
    function getcolor(value){
        var color = {'-2': "silver",
                '-1': "gold",
                '0': "black",
                '1': "brown",
                '2': "red",
                '3': "orange",
                '4': "yellow",
                '5': "green",
                '6': "blue",
                '7': "violet",
                '8': "grey",
                '9': "white"};
        return color[value];
    }

    /**
     * Returns the color corresponding to the tolerance value
     * @param  {string} tol tolerance
     * @return {string}     color corresponding to the tolerance value
     */
    function getToleranceColor(tol){
        var tolerance_color={
            '5':'gray',
            '10':'violet',
            '25':'blue',
            '50':'green',
            '100':'brown',
            '200':'red',
            '500':'gold',
            '1000':'silver',
            '2000':''
        };
        var val = (+tol) * 100;
        if(val in tolerance_color){
            return tolerance_color[val];
        }
        return '-1';
    }

    function toStandardForm(value){
        var replace_char;
        //remove any zeros present in the start of string
        value = String(value).replace(/^0*/,'');

        //find the replace character if it exist else default to 'R'
        //and add R to the last of the value so as to make is consistent
        //if char is not present
        replace_char = value.match(/[mMkKrR]/);
        if(!replace_char){
            replace_char = ['R'];
            value = value + 'R';
        }

        //replace '.' is exist with replace_char
        if(value.indexOf(".")!== -1){
            value = value.replace(replace_char[0], '');
            value = value.replace(".",replace_char[0]);
        }

        return value;
    }

    /**
     * Return the color bands
     * @param  {String}     resistor_value resistor value
     * @param  {double}     tol      tolerance value
     * @param  {interger}   mul      multiplier([0,3,6])
     * @return {Dict object}         band color
     */
    exports.resistorToColor = function (resistor_value, tol){
        var digit = [0, 0, 0],
            digits = [],
            dec = -1,
            mul = {
                value:'',
                pos:''
            },
            multiplier,
            significant_digit;

        //defaulting parameters if not present
        tol = tol || 5;
        mul = mul || null;

        //calculating number of digit to consider before taking the digit for multiplier
        significant_digit = tol > 2 ? 2 : 3;

        //check if resistor value exist or not...    
        if (!resistor_value){
            throw ("resistor: invalid parameter");
        }
        
        //preprocess the value
        resistor_value = toStandardForm(resistor_value);

        //setting the multiplier value k=1000*100, m=100000*100, and default=100
        //extra 100 is used to get accuracy when doing float division and multiplication
        if(/[kK]/.test(resistor_value)){
            mul['value'] = 100000;
        }else if(/[mM]/.test(resistor_value)){
            mul['value'] = 100000000;
        }else{
            mul['value'] = 100;
        }

        //remove multiplier character and replace by . if not present.
        resistor_value = resistor_value.replace(/[rRkKmM]/,'.');

        //convert resistor_value to float by unioperator +
        //round of to precision 4 to remove float point bug eg try (1.16 * 100)
        //remove trailing zeros
        //finally convert to string by ""+
        resistor_value = (""+ +(+resistor_value * mul['value']).toFixed(4));

        for (var i = 0 ; i< significant_digit ; i++){
            digits.push(resistor_value[i]?resistor_value[i]:0);
        }
        multiplier = resistor_value.length - significant_digit - 2;
        if(significant_digit == 2){
            return {
                'band1':getcolor(digits[0]),
                'band2':getcolor(digits[1]),
                'band3':getcolor(multiplier),
                'band4':'',
                'band5':getToleranceColor(tol)
            };
        }
        return {
            'band1':getcolor(digits[0]),
            'band2':getcolor(digits[1]),
            'band3':getcolor(digits[2]),
            'band4':getcolor(multiplier),
            'band5':getToleranceColor(tol)
        };
    };

})(typeof exports === "undefined" ?this['resistor'] = {}:exports);
