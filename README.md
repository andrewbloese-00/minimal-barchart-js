# Minimal Charts JS 
A collection of animated chart components for use in your web applications. Choose from simple to use and customize charts: 
- Bar Graph
- Scatter Plot
- Pie Chart (Comming Soon)
- Line Graph (Comming Soon)


## Usage 
[Bar Chart](#barchart-example)
[Scatter Plot](#scatterplot-example)


### Bar Chart 
Use the `MinimalBarChart` class to create a barchart. Features a clean staggered animation on chart creation as well as hover interactions on the bars. Currently tooltips are auto generated and cannot be customized.  

#### Arguments
#####  root 
> type: HTMLElement 

An element in the DOM to append the chart element to. (I.E `document.body`)

##### props 
> type: BarChartProps 




#### BarChartProps 

##### dataset
> type: number[][]

A 2-Dimensional array containing the chart datapoints, each row being a unique dataset to plot. See example. 


#####  labels
> type: string[],

The labels for the chart x axis. Length should be equal to number of columns in dataset

##### colors: 
> type: string[]

The css color values corresponding to the chart datasets. 

##### dims
> type: string[]

An array of length 2 in the form [width,height]. Expects css strings (ie "10%" or "100px")



##### title (Optional)
> type: string 


If provided, the text to be displayed as the title of the chart (top center)

##### axisTitles (Optional)
> type: { x?: string, y?: string }

If provided, the title text for the x and/or y axis of the chart. If not provided no axis titles are created. 
* Note: when adding y axis titles, a 25px margin-left and padding-left are applied to the chart container to avoid overflow. 

#### Barchart Example
The following example shows how to create a bar chart with 2 different bars per x value. To include more, just add more data to the `dataset`

```javascript
    const barchart = new MinimalBarChart(document.body,{
        labels:  ["sun","mon","tue","wed","thu","fri","sat"],
        dataset: [ 
            [50,30,20,60,23,50,90],
            [40,52,33,26,30,25,99]
        ],
        colors: ["blue","lime"],
        dims: ["50%","300px"],
        title: "Example Barchart",
        axisTitles: { 
            y: "Earnings ($)",  
            x: "" //left blank will not create x axis title...
        }
    })
```
  

### ScatterPlot
Use the `MinimalScatterPlot` class to construct a scatterplot. Features a staggered animation on creation and auto generated tooltips on hover of points on the chart. 

#### Arguments

##### root
> type: HTMLElement 

An HTML element present in the DOM to append the chart to 
* (ie) document.body


##### Props
> type: ScatterPlotProps


#### ScatterPlotProps

##### dataset 
> type: { [sampleName:string]:number[][] }

An object whose keys are the names of the samples present in the chart, and whose values are an array of points. Each point is an array of length 2 in the form: [xValue,yValue]. 


##### colors
> type :{ [sampleName:string]: string}
An object whose keys are the names of the samples present in the chart, and whose values are strings holding css color values. 


##### dims
> type: string[]

An array of length 2 in the form [width,height]. Expects css strings (ie "10%" or "100px")

##### title (Optional)
> type: string

If provided the text to display as the chart title (top center)


##### axisTitles (Optional)
> type: {x?: string, y?:string}

If provided, the title text for the x and/or y axis of the chart. If not provided no axis titles are created. 
* Note: when adding y axis titles, a 25px margin-left and padding-left are applied to the chart container to avoid overflow. 

#### ScatterPlot Example
```javascript

    //generate some data points [x,y]
    const samples1 = [[0,100],[1,80],[2,75],[3,65],[4,40],[5,40],[6,40]]
    const samples2 = samples1.map(s=>s.reverse())
    const samples3 = samples1.map(e=>e.map(x=>x+5))

    const scatterPlot = new MinimalScatterPlot(document.body,{
        dataset: {
            samples1,samples2,samples3,
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
        dims: ["50%","300px"]
    })

```


