let apiURL = "http://tears-of-devil.com/smart/smart/api.php";        
        let itemsListURL = apiURL + "?data=1";
        let dataSendURL = "";
        let collorImage = "assets/images/colors.png";

        fetchList((error, data) => {
            if (error) {
                console.log(error);
                //show loading
                //retry after 10 s max 3~5 times
                //if still error show OPS something is wrong !
            } else {
                printDevices(data);
            }
        });

        function fetchList(callback) {
            fetch(itemsListURL)
                .then(response => response.json())
                .then(json => callback(null, json))
                .catch(error => callback(error, null))
        }

        function dataSend(callback) {
            fetch(dataSendURL)
                .then(response => response.json())
                .then(json => callback(null, json))
                .catch(error => callback(error, null))
        }

        function printDevices(data) {

            data.forEach((element, key) => {
                let item = document.createElement("LI");
                let itemSwitch = "off";
                if (element.state == "1") {
                    itemSwitch = "on";
                }
                item.innerHTML = '<span>' + element.name + '</span><div class="switch --t05">' + itemSwitch + '</div>';
                let att = document.createAttribute("data-stat");
                att.value = element.state;
                item.setAttributeNode(att);
                att = document.createAttribute("item-id");
                att.value = element.itemId;
                item.setAttributeNode(att);
                att = document.createAttribute("item-color");
                att.value = element.color;
                item.setAttributeNode(att);
                item.classList.add("--t05");
                devicesContainer.appendChild(item);
                devicesContainer.querySelectorAll("li")[key].querySelector("span").addEventListener('click', itemSetup);
                devicesContainer.querySelectorAll("li")[key].querySelector("div").addEventListener('click', switchClick);
            })
        }

        const devicesContainer = document.getElementById("devices").querySelector("ul");
        const canvasHolder = document.getElementById("colors");
        const header = document.getElementById("header");
        const currentColor = document.getElementById("currentColor");
        let screenStat = 0;

        function switchClick() {
            if (this.parentElement.getAttribute("data-stat") == "1") {
                this.parentElement.setAttribute("data-stat", "0");
                this.innerHTML = "off";
            } else {
                this.parentElement.setAttribute("data-stat", "1");
                this.innerHTML = "on";
            }

            let thisID = this.parentElement.getAttribute("item-id");
            let thisStat = this.parentElement.getAttribute("data-stat");

            dataSendURL = apiURL + "?data=2&id=" + thisID + "&stat=" + thisStat;

            dataSend((error, data) => {
                if (error) {
                    console.log(error);
                    //show loading
                    //retry after 10 s max 3~5 times
                    //if still error show OPS something is wrong !
                } else {
                    //console.log(data);
                }
            });
        };

        function homeScreen() {
            canvasHolder.style.display = "none";
            header.querySelector("nav").removeEventListener('click', homeScreen);           
            let allItemsList = devicesContainer.querySelectorAll("li");

            allItemsList.forEach((element) => {
                element.removeAttribute("data-active");
            });

            header.classList.remove("header--item");
            header.classList.add("header--home");
            header.querySelector("h3").innerHTML = "My Devices";
        }

        function itemSetup() {
            canvasHolder.style.display = "block";
            let allItemsList = devicesContainer.querySelectorAll("li");

            allItemsList.forEach((element) => {
                element.setAttribute("data-active", "0");
            });

            this.parentElement.setAttribute("data-active", "1");

            header.classList.remove("header--home");
            header.classList.add("header--item");
            header.querySelector("h3").innerHTML = "Device Settings";

            header.querySelector("nav").addEventListener('click', homeScreen);

            let thisColor = devicesContainer.querySelector("li[data-active='1']").getAttribute("item-color");
            currentColor.style.backgroundColor = "rgb(" + thisColor + ")";
        };

        function getOffset(el) {
            var rect = el.getBoundingClientRect();
            return {
                left: rect.left + window.pageXOffset,
                top: rect.top + window.pageYOffset
            };
        }

        function sendColor(e) {
            let x = e.clientX;
            let y = e.clientY;
            let cursor = "Your Mouse Position Is : " + x + " and " + y;
            let myCanvas = canvasHolder.querySelector("canvas");
            let pixelX = x - getOffset(myCanvas).left;
            let pixelY = y - getOffset(myCanvas).top;
            let pixelCoordinates = "Your Mouse Position Is : " + pixelX + " and " + pixelY;

            const {
                data
            } = context.getImageData(pixelX, pixelY, 1, 1);
            currentColor.style.backgroundColor = "rgb(" + data[0] + "," + data[1] + "," + data[2] + "," + data[3] + ")";
            devicesContainer.querySelector("li[data-active='1']").setAttribute("item-color", + data[0] + "," + data[1] + "," + data[2] + "," + data[3]);
            let thisID = devicesContainer.querySelector("li[data-active='1']").getAttribute("item-id");
            let thisColor = devicesContainer.querySelector("li[data-active='1']").getAttribute("item-color");
            dataSendURL = apiURL + "?data=3&id=" + thisID + "&color=" + thisColor;

            dataSend((error, data) => {
                if (error) {
                    console.log(error);
                    //show loading
                    //retry after 10 s max 3~5 times
                    //if still error show OPS something is wrong !
                } else {
                    //console.log(data);
                }
            });
        }


        var canvas = document.createElement('canvas');
        var context = canvas.getContext("2d");
        canvas.id = "canvas_id";
        canvas.className = "canvas";                  
        canvas.height = 250;                         
        canvas.width = 250;
        var image = new Image();
        image.onload = function () {
            context.drawImage(this, 0, 0); 
        }       
        image.src = collorImage;
        let att = document.createAttribute("onclick");
        att.value = "sendColor(event)";
        canvas.setAttributeNode(att);
        canvasHolder.appendChild(canvas);