console.log("Hello World!");

class TimeSelector {
    constructor(root) {
        this.root = root
        this.time_container = this.#createContainer()
        this.root.appendChild(this.time_container)
        this.children = []
    }

    #createContainer() {
        let container_tag = document.createElement("ul")
        container_tag.setAttribute("class", "time-select-list")
        return container_tag
    }

    #createTimeElement(text) {
        let time_element = document.createElement("li")
        time_element.setAttribute("class", "time-select-item")

        return time_element
    }

    setData(data) {
        this.clear()
        for(time_ms of data) {
            date = new Date(time_ms)
            element = this.#createTimeElement(date.getLocaleTime())
        }
    }

    clear() {
        for(child of this.children) {
            this.time_container.removeChild(child)
        }
        this.children = []
    }


}

class DateSelector {
    constructor(root, index) {
        this.root = root;
        [this.date_container, this.text_tag] = this.#createContainer(index)
        this.root.appendChild(this.date_container)
        this.time_selector = new TimeSelector(this.date_container)
    }

    #createContainer(index) {
        let container_tag = document.createElement("div")
        container_tag.setAttribute('id', "container-"+index.toString())
        container_tag.setAttribute(`class`, "day-selector")

        let radio_tag = document.createElement("input")
        radio_tag.setAttribute("type", "radio")
        radio_tag.setAttribute("name", "day-selected")
        radio_tag.setAttribute('class', "day-radio")
        radio_tag.setAttribute("id", "radio-day-"+index.toString())
        radio_tag.setAttribute("value", index.toString())

        let text_tag = document.createElement("label")
        text_tag.setAttribute("for", "radio-day-"+index.toString())
        text_tag.textContent = ""

        container_tag.appendChild(radio_tag)
        container_tag.appendChild(text_tag)

        return [container_tag, text_tag]
    }

    setEnabled(day, data) {
        this.date_container.classList.add("day-enabled")
        this.date_container.classList.remove("day-disabled")
        this.text_tag.textContent = day
        this.time_selector.setData(data)
    }

    setDisabled(day) {
        this.date_container.classList.add("day-disabled")
        this.date_container.classList.remove("day-enabled")
        this.text_tag.textContent = day
        this.time_selector.setData([])
    }

}

class Calendar {
    constructor(root) {
        this.root_element = root;
        this.month_tag = document.getElementById("month")
        this.sub_elements = this.#addElements(root);
        var now = new Date(Date.now());
        this.currentTime = now;
        this.selectedMonth = this.currentTime;
        this.fillCurrentMonth(this.currentTime);
        this.setMonthTag(this.currentTime);
    }

    #addElements(root) {
        var new_elements = [];
        for(let i =0; i < (7*6); i++) {
            let day_selector = new DateSelector(root, i)
            new_elements.push(day_selector)
        }
        return new_elements;
    }

    next_month() {
        this.selectedMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, this.selectedMonth.getDate())
        this.updateVisual();
    }

    prev_month() {
        this.selectedMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() - 1, this.selectedMonth.getDate())
        this.updateVisual();
    }

    updateVisual() {
        this.flush();
        this.fillCurrentMonth(this.selectedMonth)
        this.setMonthTag(this.selectedMonth)
    }

    flush() {
        this.sub_elements.forEach( (e) => {
        e.textContent = "";
        });
    }

    //takes a DateObject of current month and fills the elements
    fillCurrentMonth(month) {
        let to_update = this.sub_elements;
        let start_month = month;
        month.setDate(1);
        let start_idx = month.getDay();
        let total_fill = new Date(month.getYear(), month.getMonth()+1, 0).getDate();
        for (let i = 0; i < (total_fill); i++) {
            to_update[start_idx + i].setDisabled(i);
        }
    }

    setMonthTag(month) {
        this.month_tag.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric'}).format(month);
    }
}

calendar = new Calendar(document.getElementById("calendar"));

function overlay_on() {
    document.getElementById("overlay").style.display = "flex";
    document.body.classList.add("noscroll");
    document.getElementById("body").classList.add("blur")
    fillCalendar();
}

document.getElementById("overlay").addEventListener("click", function( e ){
    e = window.event || e; 
    if(this === e.target) {
    document.getElementById("overlay").style.display = "none";
    document.body.classList.remove("noscroll")
    document.getElementById("body").classList.remove("blur")
    }
});

function next_month() {
    calendar.next_month();
}

function prev_month() {
    calendar.prev_month();
}

function fillCalendar() {

}
