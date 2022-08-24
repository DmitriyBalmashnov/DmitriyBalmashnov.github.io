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

    #add(element) {
        this.time_container.appendChild(element)
        this.children.push(element)
    }

    #createTimeElement(text) {
        let time_element = document.createElement("button")
        time_element.setAttribute("class", "time-select-item")
        time_element.textContent = text

        return time_element
    }

    setData(data) {
        this.clear()
        for(let time_ms of data) {
            let date = new Date(time_ms)
            let element = this.#createTimeElement(date.toLocaleTimeString())
            element.addEventListener('click', (e) => {
                set_selected_timeslot(time_ms)
                e.stopPropagation()
            })
            this.#add(element)
        }
    }

    clear() {
        for(let child of this.children) {
            this.time_container.removeChild(child)
        }
        this.children = []
    }


}

class DateSelector {
    constructor(root, index, days) {
        this.root = root;
        [this.date_container, this.text_tag] = this.#createContainer(index, days)
        this.root.appendChild(this.date_container)
        this.time_selector = new TimeSelector(this.date_container)
        this.is_active = false;
    }

    #createContainer(index, days) {
        let container_tag = document.createElement("div")
        container_tag.setAttribute('id', "container-"+index.toString())
        container_tag.setAttribute(`class`, "day-selector")

        let text_tag = document.createElement("p")
        text_tag.textContent = ""

        container_tag.addEventListener("click", (event) => {
            if(this.is_active) {
                days.select(this)
                event.stopPropagation()
            }
        })
        container_tag.addEventListener("mouseenter", () => {
            if(this.is_active) {
                days.hoverStart(this)
            }
        })
        container_tag.addEventListener("mouseleave", () => {
            if(this.is_active) {
                days.hoverEnd(this)
            }
        })

        container_tag.appendChild(text_tag)

        return [container_tag, text_tag]
    }

    setEnabled(day, data) {
        this.date_container.classList.add("day-enabled")
        this.date_container.classList.remove("day-disabled")
        this.text_tag.textContent = day
        this.is_active = true;
        this.time_selector.setData(data)
    }

    setDisabled(day) {
        this.date_container.classList.add("day-disabled")
        this.date_container.classList.remove("day-enabled")
        this.text_tag.textContent = day
        this.is_active = false;
        this.time_selector.setData([])
    }

    select() {
        console.log("selected")
        this.date_container.classList.add("day-selected")
    }

    unselect() {
        console.log("unselected")
        this.date_container.classList.remove("day-selected")
    }
}

class Days {
    constructor() {
        this.current_selection = null
    }

    select(selector) {
        if(this.current_selection === selector) {
            this.current_selection.unselect()
            this.current_selection = null
            return
        }
        if(this.current_selection !== null) {
            this.current_selection.unselect()
        }
        this.current_selection = selector
        this.current_selection.select()
    }

    unselect() {
        if(this.current_selection) {
            this.current_selection.unselect()
            this.current_selection = null
        }
    }

    hoverStart(selector) {
        if(this.current_selection === null) {
            selector.select()
        }
    }

    hoverEnd(selector) {
        if(this.current_selection === null) {
            selector.unselect()
        }
    }
}

class Calendar {
    constructor(root) {
        this.root_element = root;
        this.month_tag = document.getElementById("month")
        this.days = new Days();
        this.sub_elements = this.#addElements(root, this.days);
        var now = new Date(Date.now());
        this.currentTime = now;
        this.selectedMonth = this.currentTime;
        this.fillCurrentMonth(this.currentTime);
        this.setMonthTag(this.currentTime);
    }

    #addElements(root, days) {
        this.root_element.addEventListener("click", (event)=> {
            days.unselect()
            event.stopPropagation()
        })
        var new_elements = [];
        for(let i =0; i < (7*6); i++) {
            let day_selector = new DateSelector(root, i, days)
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
        for(let element of this.sub_elements) {
            element.setDisabled("")
        }
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
            if(i % 2 == 0) {
                to_update[start_idx + i].setEnabled(i,[ 5000, 30000, 50000 ])
            }
        }
    }

    setMonthTag(month) {
        this.month_tag.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric'}).format(month);
    }
}

class QueuePerson {
    constructor(root) {
        this.root = root;

    }
}

class Queue {
    constructor(root) {
        this.root =
        this.active_people = []
        this.inactive_people = []
        this.queue_active = false
    }
}

function set_selected_timeslot(time_ms) {
    console.log(`timeslot selected: ${time_ms}`)
    //timeslot = document.getElementById("timeslot")
    //timeslot.setAttribute('value', time_ms)
}
    
calendar = new Calendar(document.getElementById("calendar"));
let about_active = ""

function overlay_on(target_about) {
    document.getElementById("overlay").style.display = "flex";
    document.getElementById(target_about).style.display = "flex";
    about_active = target_about
    document.body.classList.add("noscroll");
    document.getElementById("body").classList.add("blur")
    fillCalendar();
}

document.getElementById("overlay").addEventListener("click", function( e ){
    e = window.event || e; 
    if(this === e.target) {
        document.getElementById("overlay").style.display = "none";
        document.getElementById(about_active).style.display = "none"
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
