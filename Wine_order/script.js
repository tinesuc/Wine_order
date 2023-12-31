counter = 0;
time = 0;
time2 = 0;
bool = true;
bool2 = true;
zoom = 1;
num_of_inputs = 0;
wines_list = [];
wines_volume = 0;
wsum = 0;
info_list = Array(6).fill(0);
isum = 0;
aspect = 0;
wh = 0;
ww = 0;
resize_h_runs = 0;
prev_w = 0;
prev_h = 0;
wine_to_draw = [];

w_volume = 0;
w_todraw = [];
inp_prev=false;

get_img_px = (img)=>{
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    var pixelData = canvas.getContext('2d').getImageData(img.width/2,img.height/1.8, 1, 1).data;
    return "rgba("+pixelData[0]+","+pixelData[1]+","+pixelData[2]+","+pixelData[3]+")";
}
clamp = (num, min, max) => {
    if (num == "NaN") {
        num = "0";
        return;
    }
    num = Math.max(0, num);
    num = Math.min(max, num);
    return num;
}
manage_input_panel = (event) => {
    //if(Date.now()-time2>0&&bool2){
    bool2 = false;
    time2 = Date.now();

    let table_div = document.querySelector(".info_item");
    let cssWidth = 0;
    let children = table_div.children;
    for (let i = 0; i < children.length; i++) {
        cssWidth += parseInt(children[i].offsetWidth, 10);
    }
    let displayWidth = table_div.clientWidth;

    tab = document.querySelector('#table');
    if (displayWidth < cssWidth * 0.99 && !tab.classList.contains("folded_input")) {
        tab.classList.add("folded_input");
    } else {
        tab = document.querySelector("#table");
        tab.classList.remove("folded_input");
        cssWidth = 0;
        let children = table_div.children;
        for (let i = 0; i < children.length; i++) {
            cssWidth += parseInt(children[i].offsetWidth, 10);
        }
        let displayWidth = table_div.clientWidth;
        if (displayWidth < cssWidth * 0.99) {
            scaltab = document.querySelector('#table');
            tab.classList.add("folded_input");
        }
    }
    bool2 = true;
    //}
}
manage_wine_items = (event, runs) => {

    //-----wine list items count-----aspect ratio:6-10----item count 3-6/7---||---------------low frame aspect-ratio: wrap control_panel------flex-flow: column;---liheight*2-+-flex corection/2
    //if(Date.now()-time>0&&bool){
    bool = false;
    time = Date.now();
    for (i = 0; i < runs; i++) {
        let con_pane = document.querySelector(".control_pane");
        let scrollWidth = con_pane.scrollWidth;
        let displayWidth = con_pane.clientWidth;
        let root = document.querySelector(":root");
        let scale = parseInt(window.getComputedStyle(root).getPropertyValue('--num-of-items'));
        //console.log(root.style);    

        if (displayWidth < scrollWidth) {
            scale += 1;
            if (scale > 7) {
                scale /= 2;
                sel = document.querySelector('#selector');
                sel.classList.add("folded_wine");
            }
            root.style.setProperty('--num-of-items', Math.min(scale, 7));
            //console.log("cliped  "+(counter++)+"   "+Math.min(scale+1,7));
        } else {
            sel = document.querySelector("#selector");
            if (scale <= 4 && sel.classList.contains("folded_wine")) {
                scale *= 2;
                sel.classList.remove("folded_wine");
            }
            scale -= 1;
            root.style.setProperty('--num-of-items', Math.max(scale, 1));
            scrollWidth = con_pane.scrollWidth;
            displayWidth = con_pane.clientWidth;
            root = document.querySelector(":root");
            scale = parseInt(window.getComputedStyle(root).getPropertyValue('--num-of-items'));
            if (displayWidth < scrollWidth) {
                scale += 1;
                if (scale > 7) {
                    scale /= 2;
                    sel = document.querySelector('#selector');
                    sel.classList.add("folded_wine");
                }
                root.style.setProperty('--num-of-items', Math.min(scale, 7));
            }
        }
    }

    bool = true;
    //}


    /*
     wine_item
     d:block
     wine_pane
     height:50%
     control_pane
     max:width:100%
     height:50%s
     */

}
manage_anim = (event) => {
    let containers = document.querySelectorAll(".text");
    for (i = 0; i < containers.length; i++) {
        container = containers[i];

        let padding_left = parseFloat(window.getComputedStyle(container, null).getPropertyValue('padding-left'));
        let padding_right = parseFloat(window.getComputedStyle(container, null).getPropertyValue('padding-right'));
        let text = container.querySelector("span");
        if (container.clientWidth - padding_left - padding_right < text.clientWidth) {
            text.classList.add("animate");
        } else {
            text.classList.remove("animate");
        }
    }
}
resize_handle = (event) => {

    zoom = window.devicePixelRatio * 1;
    console.log(zoom);
    ww = window.innerWidth;
    wh = window.innerHeight;
    aspect = ww / wh;
    //console.log(aspect);
    let root = document.querySelector(":root");
    root.style.setProperty('--zoom', zoom);
    root.style.setProperty('--aspect', aspect);
    pw = prev_w / ww;
    ph = prev_h / wh;
    prev_w = ww;
    prev_h = wh;
    if (pw < 0.99 || pw > 1.01 || ph < 0.99 || ph > 1.01) {
        for (i = 0; i < 7; i++) {
            //resize_handle(event);
        }
    }
    //----overflowing text-----

    manage_anim(event);

    //-------------
    manage_input_panel(event);
    manage_wine_items(event, 1);
    bottle = document.querySelector("#bottle_panel");
    want_h = 1;
    root.style.setProperty('--want-h', want_h);
    bh = parseInt(window.getComputedStyle(bottle).getPropertyValue('height'));
    //console.log(ww+"  "+wh);
    //console.log(bh);

    mph = wh * 0.9;
    //console.log(mph);

    want_h = mph / bh / zoom * 0.9;
    if (bh * zoom * want_h > mph) {
        want_h = mph / bh * 0.9;
    }

    root.style.setProperty('--want-h', want_h);



};
function stackCanvas(c1, c2) {

    d1 = c1.getImageData(0, 0, c1.canvas.width, c1.canvas.height).data;
    d2 = c2.getImageData(0, 0, c2.canvas.width, c2.canvas.height).data;
    if (d1.length != d2.length) {
        console.log((counter++) + "   not same size");
    }
    canva = document.createElement('canvas');
    cO = canva.getContext("2d");
    cO.fillRect(0, 0, c1.canvas.width, c1.canvas.height);
    dO = cO.getImageData(0, 0, c1.canvas.width, c1.canvas.height);
    for (i = 3; i < d1.length; i += 4) {
        a1 = d1[i];
        a2 = d2[i];
        r1 = d1[i - 1];
        r2 = d2[i - 1];
        g1 = d1[i - 2];
        g2 = d2[i - 2];
        b1 = d1[i - 3];
        b2 = d2[i - 3];

        a = a2;
        r = ((255 - a2) * r1 + a2 * r2) / 255;
        g = ((255 - a2) * g1 + a2 * g2) / 255;
        b = ((255 - a2) * b1 + a2 * b2) / 255;

        dO[i] = a;
        dO[i - 1] = r;
        dO[i - 2] = g;
        dO[i - 3] = b;
    }
    console.log(dO);
    cO.putImageData(dO, 0, 0);
    return cO;
}

draw_bottle = () => {
    canvas = document.querySelector("#canvas");
    ct = canvas.getContext("2d");
    /*
     imgM = new Image(15,60);
     imgM.src = "images/side_bottle_mask.png?khzvbkjn";
     canvasM = document.createElement('canvas');
     mask = canvasM.getContext('2d');
     
     imgM.onload = function() {
     ct.fillRect(0, 0, canvas.width, canvas.height);
     mask.drawImage(imgM, 0, 0, imgM.width,imgM.height,0,0,ct.canvas.width,ct.canvas.height);
     //console.log(mask.getImageData(0,0,mask.canvas.width,mask.canvas.height));
     ret = stackCanvas(ct, mask);
     ct.putImageData(ret.getImageData(0,0,ret.canvas.width,ret.canvas.height),0,0);
     
     
     //ct.fillStyle = 
     
     console.log("   "+mask.width+"   "+mask.height+"   "+canvas.width+"   "+canvas.height);
     
     
     };
     */
    iproc = isum / 6 / 2;
    wproc = wsum / wines_volume;// how much of the bottle will fill
    wproc = Math.pow(wproc, 1/*0.35*/);
//    
//    ct.clearRect(0, 0, canvas.width, canvas.height);
//    total =0;
//    wine_to_draw.forEach((value)=>{
//        if(value===null){return;}
//        ct.fillStyle = value.color;
//        proc = (/*iproc +*/ value.amount/wproc);
//        ct.fillRect(0, (1-total) * canvas.height, canvas.width,-canvas.height * proc);
//        total+=proc;
//        
//    });
    
    ct.fillStyle = "rgba(0,0,0,0)";
    ct.clearRect(0, 0, canvas.width, canvas.height);
    //w_volume total volume of all wines (0..1)
    w_ttl=0.005;
    w_todraw.forEach((value)=>{
        if(value===null){return;}
        ct.fillStyle = value.color;
        proc=value.amount/w_volume*0.8;
        ct.fillRect(0, (1-w_ttl) * canvas.height, canvas.width, -canvas.height * proc);
        w_ttl+=proc;
    });
}


onloadm = () => {
    //time=Date.now();
    //console.log(time+"   tz");
    ww = window.innerWidth;
    wh = window.innerHeight;
    prev_w = ww;
    prev_h = wh;

    doc_full = document.fullscreenElement;
    li = Array.prototype.slice.call(document.querySelector('#selector > ul').children)
    wines_list = Array(li.length);
    wine_to_draw = Array(li.length);
    w_todraw = Array(li.length);
    li.forEach((value, index, array) => {
        vol = value.querySelector(".text > span");
        name = vol.innerHTML;
        name = name.substring(name.lastIndexOf(" "));
        name = name.substring(0, name.length-1);
        volume = Number(name);
        wines_volume+=volume;
        w_volume+=volume;
    });
    
    num_of_inputs = li.length + 6;
    manage_input_panel(null);
    manage_wine_items(null, 7);
    resize_handle(null);
    draw_bottle();

    window.setInterval(() => {
        manage_wine_items(event, 4);
        manage_anim(event);
    }, 3000);
};
addEventListener("resize", resize_handle);

info_handle = (event, ell) => {
    info_in = document.querySelectorAll("#table li > div");
    invalids = [];
    for (i = 0; i < 5; i++) {
        inn = info_in[i];
        input = inn.querySelector(".input > input");
        id = input.id;
        value = input.value;
        if (value == "" && id != "email" || id == "email" && !input.checkValidity()) {
            if(id=="posta"){id="pošta";}
            invalids.push(id);
            continue;
        }
        if (id == "email"&&(!input.checkValidity()||value=="")) {
            value = "<span style='color:rgb(230,230,230);user-select: none;'>---</span>"
        }
        dest = document.querySelector("#s_" + id + " > .s_input");
        dest.innerHTML = value;
    }
    phn1 = document.querySelector("#phone_n1").value;
    phn2 = document.querySelector("#phone_n2").value;
    phn3 = document.querySelector("#phone_n3").value;
    dest = document.querySelector("#s_phone > .s_input");
    if (!(phn1.length == 3 && phn2.length == 3 && phn3.length == 4)) {
        if (!(phn1.length == 0 && phn2.length == 0 && phn3.length == 0)) {
            invalids.push("telefonska številka");
        } else {
            dest.innerHTML = "<span style='color:rgb(230,230,230);user-select: none;'>---</span>"
        }
    } else {
        if(phn1!=parseInt(phn1)||phn2!=parseInt(phn2)||phn3!=parseInt(phn3)){
            invalids.push("telefonska številka");
        }else{
            dest.innerHTML = phn1 + "-" + phn2 + "-" + phn3;
        }
    }


    if (invalids.length == 0) {
        document.querySelector("#block").classList.remove("block");
        document.querySelector("#bottle_panel").classList.add("enabled");
    }else{
        document.querySelector("#block").classList.add("block");
        document.querySelector("#bottle_panel").classList.remove("enabled");
    }
}
input_full = (event, ell) => {
    if (ell.value.length === parseInt(ell.attributes['maxlength'].value)) {
        try{
            ell.nextElementSibling.focus();
        }catch(e){
            maxlen=parseInt(ell.attributes['maxlength'].value);
            ell.value=ell.value.substring(0, maxlen);
        }
    }
}
input_empty = (event, ell) => {
    if (event.key === 'Backspace' && ell.value.length === 0) {
        ell.previousElementSibling.focus();
    }
}
filter_keys = (event, keys, ell) => {
    text = ell.value;
    tout = "";
    for (char of text) {
        if (keys.includes(char)) {
            tout += char
        }
    }
    ell.value = "";
    ell.value = tout;
}

filter_num_code = (event, ell) => {
    filter_keys(event, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], ell)
}
filter_num_clamp = (ell, min, max, step) => {
    num = Number(ell.value);
    ell.value = clamp(num, min, max, step);
}
reset_sel = (event, ell) => {
    inp = ell.parentElement.parentElement.querySelector(".input > input");
    inp.value = "0";
    parent = ell.closest('.wine_item');
    parent.classList.remove("ordered");
    //remove class for background color
    li = Array.prototype.slice.call(document.querySelector('#selector > ul').children);
    liRef = ell.closest("li");
    index = li.indexOf(liRef);
//    wines_list[index] = 0;
//    wine_to_draw[index]=null;
    w_todraw[index]=null;
//    prev = wsum;
//    wsum = wines_list.reduce((a, b) => a + b, 0);
//    if (prev != wsum) {
//        draw_bottle();
//    }
    draw_bottle();
}
num_input = (event, ell) => {
    num = parseInt(ell.value);
    if (num == "NaN") {
        num = 0;
    }
    parent = ell.closest('.wine_item');
    parent.classList.add("ordered");
    if (num == 0 || ell.value == "") {
        parent.classList.remove("ordered");
    }

    li = Array.prototype.slice.call(document.querySelector('#selector > ul').children);
    liRef = ell.closest("li");
    vol = liRef.querySelector(".text > span");
    name = vol.innerHTML;
    name = name.substring(name.lastIndexOf(" "));
    name = name.substring(0, name.length-1);
    volume = Number(name);
    index = li.indexOf(liRef)
    if (num == 0 || ell.value == "") {
//        wines_list[index] = 0;
//        wine_to_draw[index]=null;
        w_todraw[index]=null;
    } else {
//        wines_list[index] = Math.pow(clamp(num/99,0,1), 0.1)*volume;
        
        img = liRef.querySelector(".image > img");
        pix = get_img_px(img);
//        wine_to_draw[index]={
//            amount:Math.pow(clamp(num/99,0,1), 0.1)*volume,
//            color:pix
//        };
        w_todraw[index]={
            amount:Math.pow(clamp(num/99,0,1), 0.1)*volume,
            color:pix
        };
    }
//    prev = wsum;
//    wsum = wine_to_draw.reduce((a, b) => a + b.amount, 0);
//    
    
    
//    if (prev != wsum) {
//        draw_bottle();
//    }
    draw_bottle();
}
set_zero = (event, ell) => {
    if (ell.value == "") {
        ell.value = clamp(parseInt(ell.value), 0, 99);
        li = Array.prototype.slice.call(document.querySelector('#selector > ul').children),
                liRef = ell.closest("li");
        index = li.indexOf(liRef)
        wines_list[index] = 0;
        prev = wsum;
        wsum = wines_list.reduce((a, b) => a + b, 0);
        if (prev != wsum) {
            draw_bottle();
        }
    }
    ell.value = clamp(parseInt(ell.value), 0, 99);

}
cut_to_2 = (num) => {

}

form_submit = (event, ell) => {
    info_in = document.querySelectorAll("#table li > div");
    invalids = [];
    for (i = 0; i < 5; i++) {
        inn = info_in[i];
        input = inn.querySelector(".input > input");
        id = input.id;
        value = input.value;
        if (value == "" && id != "email" || id == "email" && !input.checkValidity()) {
            if(id=="posta"){id="pošta";}
            invalids.push(id);
            continue;
        }
        if (id == "email"&&(!input.checkValidity()||value=="")) {
            value = "<span style='color:rgb(230,230,230);user-select: none;'>---</span>"
        }
        dest = document.querySelector("#s_" + id + " > .s_input");
        dest.innerHTML = value;
    }
    phn1 = document.querySelector("#phone_n1").value;
    phn2 = document.querySelector("#phone_n2").value;
    phn3 = document.querySelector("#phone_n3").value;
    dest = document.querySelector("#s_phone > .s_input");
    if (!(phn1.length == 3 && phn2.length == 3 && phn3.length == 4)) {
        if (!(phn1.length == 0 && phn2.length == 0 && phn3.length == 0)) {
            invalids.push("telefonska številka");
        } else {
            dest.innerHTML = "<span style='color:rgb(230,230,230);user-select: none;'>---</span>"
        }
    } else {
        if(phn1!=parseInt(phn1)||phn2!=parseInt(phn2)||phn3!=parseInt(phn3)){
            invalids.push("telefonska številka");
        }else{
            dest.innerHTML = phn1 + "-" + phn2 + "-" + phn3;
        }
    }


    if (invalids.length != 0) {
        msg = "";
        for (i = 0; i < invalids.length; i++) {
            if (i != invalids.length - 1) {
                msg += "<span style='color:#f27474'>" + invalids[i] + "</span>, "
            } else {
                msg += "<span style='color:#f27474'>" + invalids[i] + "</span>"
            }
        }
        Swal.fire({
            title: '<strong>Napačni vnosi</strong>',
            icon: 'error',
            html: "Prosim pravilno vnesite naslednje podatke: " + msg + ".",
            confirmButtonColor: 'indigo',
            showCloseButton: true,
        })

        return;
    }



    orr_wines = document.querySelectorAll("#selector .wine_item");
    ordered = [];
    taxMap = new Map();
    totalCost = 0;
    totalTax = 0;
    baseMap = new Map();
    for (i = 0; i < orr_wines.length; i++) {
        name = orr_wines[i].querySelector(".text > span").innerHTML;
        price = orr_wines[i].querySelector(".price > span").innerHTML;
        price = Number(price.substring(0, price.length - 1));
        t=orr_wines[i].querySelector(".input > input").value;
        if(t==""){t="0";}
        amount = parseInt(t);
        tax = Number(orr_wines[i].querySelector(".w_tax").innerHTML);
        console.log((counter++) + "   " + name + "  " + price + "  " + amount + "   " + tax);



        if (amount != 0) {
            ordered.push({
                name: name,
                price: price,
                amount: amount,
                tax: tax,
                cost: (price * amount)
            });
            prevTax = Number(taxMap.get(tax));
            if (isNaN(prevTax)) {
                prevTax = 0;
            }
            taxMap.set(tax, (prevTax + tax * price * amount))

            prevBase = Number(baseMap.get(tax));
            if (isNaN(prevBase)) {
                prevBase = 0;
            }
            baseMap.set(tax, (prevBase + (1 - tax) * price * amount))

            totalCost += price * amount;
            totalTax += tax * price * amount;
        }


    }


    if (ordered.length == 0) {
        Swal.fire({
            title: '<strong>Ni naročila</strong>',
            icon: 'error',
            html: "Prosimo da izberete vina za nakup.",
            confirmButtonColor: 'indigo',
            showCloseButton: true,
        })
        return;
    }

    rec_body = document.querySelector("#s_wi_tb");
    text = "";
    for (i = 0; i < ordered.length; i++) {
        item = ordered[i];
        text += "<tr style='width:100%;'>" +
                "<td class='s_name' style='text-align:left;'>" + item.name + "</td>"+
"<td class='s_amount' style='width:15%; text-align:right;'>" + item.amount + "</td>"+
"<td class='s_tax' style='width:15%; text-align:right;'>" + (item.tax * 100).toFixed(2) + "</td>"+
"<td class='s_price' style='width:15%; text-align:right;'>" + (item.price).toFixed(2) + "</td>"+
"<td class='s_cost' style='width:20%; text-align:right;'>" + item.cost.toFixed(2) + "</td>" +
                "</tr>";
    }
    rec_body.innerHTML = text;
    rec_total = document.querySelector("#s_total");
    rec_total.innerHTML = totalCost.toFixed(2);
    //**************************************************************

    rec_tax = document.querySelector("#s_wi_tx");
    text = "";
    mapTaxK = Array.from(taxMap.keys());
    mapBaseV = Array.from(baseMap.values());
    mapTaxV = Array.from(taxMap.values());


    for (i = 0; i < mapTaxK.length; i++) {
        text += "<tr>" +
                "<td style='text-align:left;'>DDV</td>" +
                "<td style='text-align:right;'>" + ((mapTaxK[i] * 100).toFixed(2)) + "%</td>" +
                "<td style='text-align:right;'>" + (mapBaseV[i].toFixed(2)) + "</td>" +
                "<td style='text-align:right;'>" + (mapTaxV[i].toFixed(2)) + "</td>" +
                "</tr>";
    }
    rec_tax.innerHTML = text;
    rec_tax_total = document.querySelector("#s_tax_total");
    rec_tax_total.innerHTML = totalTax.toFixed(2);


    templ = document.querySelector("#swal_templ").innerHTML;
    Swal.fire({
        title: '<strong>Izpisek vnesenih podatkov</strong>',
        icon: 'info',
        html: templ,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Potrdi nakup',
        confirmButtonColor: 'indigo',
        cancelButtonText: 'Prekliči',
        didOpen: () => Swal.getConfirmButton().focus()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Potrjeno',
                html: 'Vaš nakup je bil potrjen.',
                icon: 'success',
                confirmButtonColor: 'indigo',
                timer: 3000,
                timerProgressBar: true,
            })
        }
    })
}
