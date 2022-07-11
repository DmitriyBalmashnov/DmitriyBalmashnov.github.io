console.log("Hello World!");

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
    var tag = document.createElement("div");
    tag.setAttribute('class', 'calendar-element');
    tag.setAttribute('id', i.toString());
    tag.setAttribute('onselectstart', "return false");
    root.appendChild(tag);
    new_elements.push(tag);
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
    to_update[start_idx + i].textContent = (i+1).toString();
    }
}

setMonthTag(month) {
    this.month_tag.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric'}).format(month);
}
}

calendar = new Calendar(document.getElementById("calendar"));

function overlay_on() {
document.getElementById("overlay").style.display = "flex";
$("body").addClass("noscroll");
$("#body").addClass("blur")
fillCalendar();
}

document.getElementById("overlay").addEventListener("click", function( e ){
    e = window.event || e; 
    if(this === e.target) {
    document.getElementById("overlay").style.display = "none";
    $("body").removeClass("noscroll")
    $("#body").removeClass("blur")
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
