//demo the chart 
function onLoad(){
    //Demo: Barchart 
    const barchart = new MinimalBarChart(document.body,{
        labels:  ["sun","mon","tue","wed","thu","fri","sat"],
        dataset: [ 
            [50,30,20,60,23,50,90],
            [40,52,33,26,30,25,99],
            [40,52,33,26,30,25,99].map(x=>x-5)
        ],
        colors: ["blue","lime",'orange'],
        legend: ["This Week", "Last Week"],
        dims: ["50%","300px"],
        title: "Example Barchart",
        axisTitles: { 
            y: "Earnings ($)",  
            x: ""
        }

    })
    

    barchart.element.style.fontFamily = "sans-serif"


    //Demo: Scatter Plot
    const scatterPlot = new MinimalScatterPlot(document.body,{
        dataset: {
            samples1: [[0,100],[1,80],[2,75],[3,65],[4,40],[5,40],[6,40]],
            samples2: [[0,100],[1,80],[2,75],[3,65],[4,40],[5,40],[6,40]].map(en=>en.reverse()),
            samples3: [[0,100],[1,80],[2,75],[3,65],[4,40],[5,40],[6,40]].map(en=>en.map(x=>x+5))
        },
        colors: {
            samples1: "violet",
            samples2: "orange",
            samples3: "royalblue"
        },
        title: "Example Scatter Plot",
        axisTitles: {
            x: "Time",
            y: "Energy"
        },
        dims: ["600px","300px"]
    })


    //TODO: Demo Line Chart

    //TODO: Demo Pie Chart
    


}

document.addEventListener("DOMContentLoaded",onLoad)