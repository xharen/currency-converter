const exchange_url = 'https://v6.exchangerate-api.com/v6/9f5ce6956039ac3cbaba96c1';

function calculate_curreny()
{
    let amount_input = document.querySelector(".amount input");
    if (amount_input.classList.contains("wrong-input"))
    {
        return false;
    }

    let from_span = document.querySelector("#from-dropdown .dropdown-item-text span");
    let to_span = document.querySelector("#to-dropdown .dropdown-item-text span");
    let exchangerate_span = document.querySelector(".exchange-rate span");

    var calculate = async function(){
        const response = await fetch(exchange_url + '/latest/' + from_span.textContent.split(" - ")[0]);
        const data = await response.json();
        const value = data.conversion_rates[to_span.textContent.split(" - ")[0]] * amount_input.value;
    
        exchangerate_span.lastChild.textContent =  `${amount_input.value}  ${from_span.textContent.split(" - ")[0]} = ${value} ${to_span.textContent.split(" - ")[0]}`;   
    }();
}

window.onload = (event) => {
    let list = document.querySelector("#from-dropdown ul.dropdown-list");
    let list2 = document.querySelector("#to-dropdown ul.dropdown-list");
    list.innerHTML = "";
    list2.innerHTML = "";

    for (currency in currencies)
    { 
        let itemTag = `<a href="#"><li class="dropdown-item"><img src="https://flagicons.lipis.dev/flags/4x3/${currencies[currency].toLowerCase()}.svg"/>${currency}</li></a>`;
        list.insertAdjacentHTML("beforeend", itemTag);
        list2.insertAdjacentHTML("beforeend", itemTag);
    }

    document.querySelector(".reverse-div button").addEventListener("click", function(){
        let from_span = document.querySelector("#from-dropdown .dropdown-item-text span");
        let to_span = document.querySelector("#to-dropdown .dropdown-item-text span");
        let from_img = document.querySelector("#from-dropdown .dropdown-item-icon img");
        let to_img = document.querySelector("#to-dropdown .dropdown-item-icon img");

        var backup_image = from_img.src;
        from_img.src = to_img.src;
        to_img.src = backup_image;
        
        var backup_text = from_span.textContent;
        from_span.textContent = to_span.textContent;
        to_span.textContent = backup_text;

        this.classList.toggle("reverse-button-rotated");
        calculate_curreny();
    })

    document.querySelector(".amount input").addEventListener("input", function(){
        if ((isNaN(this.value) || this.value === "") && !this.classList.contains("wrong-input"))
        {
            this.classList.toggle("wrong-input");
        }
        else if (!isNaN(this.value) && this.value !== "")
        {
            this.classList.remove("wrong-input");
        }
        calculate_curreny();
    });

    document.querySelectorAll(".dropdown-box").forEach(dropdown => {
        let searchbox = dropdown.querySelector(".dropdown-searchbox");
        let searchbox_input = searchbox.querySelector("input");
        let dropdown_list = searchbox.querySelector(".dropdown-list");

        dropdown.addEventListener("click", function(){
            //CHECK SEARCHBOX IS NOT DISPLAYING
            if (window.getComputedStyle(searchbox).display == "none")
            {
                //DISPLAY SEARCHBOX BEFORE START ANIMATION
                searchbox.style.display = "block";
    
                //START ANIMATION
                dropdown_list.style.animation = "transformAnim 0.2s";
    
                searchbox_input.focus();
            }
        });

        searchbox_input.addEventListener("blur", function(){
            //CHECK SEARCHBOX IS DISPLAYING
            if (window.getComputedStyle(searchbox).display == "block")
            {                
                //WE GONNA MAKE ONLY FADE OUT FOR SEARCH BOX
                searchbox.style.animation = "none";
                searchbox.offsetWidth; 
                searchbox.style.animation = "fadeOut 0.3s reverse"

                //RESTART KEYFRAME
                dropdown_list.style.animation = "none";
                dropdown_list.offsetWidth; 
                dropdown_list.style.animation = "transformAnim 0.2s reverse";

                //WHEN ANIMATION END, REMOVE ANIMATION STYLE AND MAKE DISPLAY NONE
                dropdown_list.addEventListener("animationend", () => {
                    searchbox.style.animation = "";
                    dropdown_list.style.animation = "";
                    searchbox.style.display = "none";
                }, {once: true})
            }
        });

        searchbox_input.addEventListener("keyup", function() {
            let filter = searchbox_input.value.toUpperCase();
            let a = dropdown_list.querySelectorAll("a");

            a.forEach(elem => {
                let li =  elem.getElementsByTagName("li")[0];
                let txtValue = li.textContent;

                elem.style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
            });
        });

        let dropdown_list_items = dropdown_list.querySelectorAll("a")
        dropdown_list_items.forEach(item => {
            item.addEventListener("click", function() {
                var img = item.querySelector("img");
                var dropdown_icon = dropdown.querySelector(".dropdown-item-icon");
                var dropdown_icon_img = dropdown.querySelector(".dropdown-item-icon img");

                if (img != null)
                {
                    dropdown_icon_img.src = img.src;
                }

                dropdown.querySelector(".dropdown-item-text span").textContent = item.textContent;
                calculate_curreny();
            });
        });
    });

};