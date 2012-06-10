# Fluid Grid

## What is it? 

Fluid, Responsive and Semantic grid is built for LESS CSS. It supports any number 
of columns. Gutter width is defined as percentage (rendered as left margin), and 
grids can be nested too. [View demo](http://akikoo.github.com/Fluid-Grid/demo.html)

## Requirements for a reusable, fast and flexible grid system

I believe a CSS grid system should meet the following requirements so that it can 
be used as a reusable build tool in every project:

* Flexible, supporting any number of columns and gutter widths, as required by the 
	design (I don't want any default grid)
* Allows fast grid prototyping (requires CSS preprocessor)
* Fluid, percentage-based (fixed width grids can be easily generated by giving 
	the containing row a fixed width, if needed)
* Responsive, mobile first approach, applying the grid only if there's enough screen 
	estate
* Nested but keeping the same root grid classes (I want to able to split the container 
	row by the number of columns the container has; it doesn't make sense to have class 
	"grid-6" inside a parent that has a class "grid-6" if I want to split that 
	parent in two. Instead, I want to use the same class than in the root level: "grid-3". 
	This is different than what the Twitter Bootstrap or ZURB Foundation currently 
	do).
* Backwards compatible, cross-browser support (preferably incl. IE7+), no JavaScript 
	dependancies
* Right to Left language support easily added
* Ability to decide whether to use unsemantic ".grid-x" classes, or my own.

So basically what we have here is The Semantic Grid (http://semantic.gs/) and Trevor 
Davis' Sass & Compass Grid (http://viget.com/inspire/building-a-nested-responsive-grid-with-sass-compass) 
merged together, in LESS CSS.

## Examples of usage

The grid is based on rows that can be nested inside other rows. Each row can
contain multiple columns, up until the number of columns in the parent column.

For example, let's say you want 12 columns with 4% gutter (default settings).
Put this in your cols.less stylesheet:

<pre>
// First level
.col {
    margin: 0 0 0 @gutter;
}
.two {
    .columns(2);
}
.three {
    .columns(3);
}
.four {
    .columns(4);
}</pre>

That compiles to:

<pre>
// First level
.col {
    margin: 0 0 0 4%;
}
.two {
    width: 13.333333333333334%;
}
.three {
    width: 22%;
}
.four {
    width: 30.666666666666668%;
}</pre>

And here's the markup:

<pre>&lt;div class="row"&gt;
    &lt;div class="col three"&gt;&lt;/div&gt;
    &lt;div class="col three"&gt;&lt;/div&gt;
    &lt;div class="col four"&gt;&lt;/div&gt;
    &lt;div class="col two"&gt;&lt;/div&gt;
&lt;/div&gt;</pre>

You can use your own semantic class names instead, if you fancy that. For example:

<pre>
// First level
.navigation {
    .columns(2);
}
.complementary,
.contentinfo {
    .columns(3);
}
.main {
    .columns(4);
}</pre>

The markup:

<pre>&lt;div class="row"&gt;
    &lt;section class="col main"&gt;&lt;/section&gt;
    &lt;aside class="col complementary"&gt;&lt;/aside&gt;
    &lt;nav class="col navigation"&gt;&lt;/nav&gt;
    &lt;footer class="col contentinfo"&gt;&lt;/footer&gt;
&lt;/div&gt;</pre>

One more example: a nested grid, three levels deep. Your cols.less stylesheet:

<pre>
// First level
.col {
    margin: 0 0 0 @gutter;
}
.five {
    .columns(5);
}
.seven {
    .columns(7);
}

// Second level:
// .nestedcolumns(children, parent);
.five .two {
    .nestedcolumns(2, 5);
}
.five .three {
    .nestedcolumns(3, 5);
}
.seven .three {
    .nestedcolumns(3, 7);
}
.seven .four {
    .nestedcolumns(4, 7);
}

// Third level:
.seven .four .two {
    .nestedcolumns(2, 4);
}</pre>

That compiles to:

<pre>
// First level
.col {
    margin: 0 0 0 4%;
}
.five {
    width: 39.333333333333336%;
}
.seven {
    width: 56.66666666666667%;
}

// Second level:
// .nestedcolumns(children, parent);
.five .two {
    margin-left: 10.169491525423728%;
    width: 33.89830508474576%;
}
.five .three {
    margin-left: 10.169491525423728%;
    width: 55.932203389830505%;
}
.seven .three {
    margin-left: 7.0588235294117645%;
    width: 38.8235294117647%;
}
.seven .four {
    margin-left: 7.0588235294117645%;
    width: 54.11764705882353%;
}

// Third level:
.seven .four .two {
    margin-left: 13.043478260869565%;
    width: 43.47826086956522%;
}</pre>

The markup:

<pre>&lt;div class="row"&gt;
    &lt;div class="col seven"&gt;
        &lt;div class="row"&gt;
            &lt;div class="col four"&gt;
                &lt;div class="row"&gt;
                    &lt;div class="col two"&gt;&lt;/div&gt;
                    &lt;div class="col two"&gt;&lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
            &lt;div class="col three"&gt;&lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="col five"&gt;
        &lt;div class="row"&gt;
            &lt;div class="col three"&gt;&lt;/div&gt;
            &lt;div class="col two"&gt;&lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;</pre>

In most cases, it's unlikely that you need more than three levels of grid
nesting. (I haven't tested this grid deeper than that, but it should work.)

##Generating a new grid

You can generate any number of columns just by changing two variables. To generate 
a new grid, do the following: 

1. Uncomment and override the default values of @columns and @gutter variables in 
	styles.less and styles-ie.less, to suit you needs. 
2. Adapt your grid classes in /less/cols.less and call the .columns(@num) and 
	.nestedcolumns(children, parent) mixins. The reason for having a separate 
	cols.less file is that this way we can reuse the same column styles for oldIE 
	(<IE9), including those styles without @media queries in styles-ie.less. 
3. Make sure your markup has the correct classes. 
4. Compile LESS files to CSS.

##Credits 

This grid system wouldn't exist without the many existing awesome grid frameworks. 
See the credit section in grid.less. 

I'm also using here Nicolas Gallagher's Mobile first CSS and getting Sass to help with 
legacy IE technique (http://nicolasgallagher.com/mobile-first-css-sass-and-ie/), 
in LESS CSS, to serve the same grid for oldIE (<IE9) that don't support @media queries. 
IE has min-width specified so the grid is fluid only until that point. More capable 
browsers get the responsive version. 

There are many grids, but I use this one because it gives me the flexibility I need. 
Give it a try, to see if it can help streamlining your workflow too.