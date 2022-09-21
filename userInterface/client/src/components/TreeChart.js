import React, { useRef, useEffect } from "react";
import { select, hierarchy, tree, linkHorizontal } from "d3";
import useResizeObserver from "./useResizeObserver";
import classes from "./TreeChart.module.css";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function TreeChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // we save data to see if it changed
  const previouslyRenderedData = usePrevious(data);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    // use dimensions from useResizeObserver,
    // but use getBoundingClientRect on initial render
    // (dimensions are null for the first render)
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // transform hierarchical data
    const root = hierarchy(data);
    const treeLayout = tree().size([height, width]);
    let k = -1;
    let i = -1;
    let x = 0;
    let o = -1;
    let y = 0;
    let t = -1;

    let count = 0;
    const rightlinkGenerator = linkHorizontal()
      .x((link) => {
        if (count % 2 == 0) {
          o *= -1;
        }
        count += 1;

        if (k === -1) {
          k *= -1;
        }

        if (i === -1 || i === 0) {
          i += 1;
        }
        return link.y * o + 400 * k - i * 150;
      })
      .y((link) => link.x + 12);

    // enrich hierarchical data with coordinates
    treeLayout(root);

    console.warn("descendants", root.descendants());
    console.warn("links", root.links());
    k = -1; // for x
    i = -1; // for x
    x = 0; //initial for x
    y = 0; // initial for y
    t = -1; // for y
    const numberOfNodes = data.children.length;
    // nodes
    svg
      .selectAll(".node")
      .data(root.descendants())
      .join((enter) => enter.append("circle").attr("opacity", 0))
      .attr("class", "node")
      .attr("cx", (node) => {
        if (numberOfNodes < 29) {
          k *= -1;
          if (i === -1 || i === 0) {
            i += 1;
          }

          if (k === -1) {
            return node.y + 750 * k - 5;
          }
          if (y === 0) {
            y += 1;
            return node.y + 250;
          }
          return node.y + 400 * k - i * 150 + 5;
        }
      })
      .attr("cy", (node) => {
        if (numberOfNodes < 29 && numberOfNodes > 25) {
          t *= -1;
          if (t === -1) {
            return node.x + 25;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12;
          }
          return node.x - 2;
        } else if (numberOfNodes < 25 && numberOfNodes > 21) {
          t *= -1;
          if (t === -1) {
            return node.x + 27;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12;
          }
          return node.x - 4;
        } else if (numberOfNodes < 21 && numberOfNodes > 15) {
          t *= -1;
          if (t === -1) {
            return node.x + 33;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12;
          }
          return node.x - 9;
        } else if (numberOfNodes < 15 && numberOfNodes > 11) {
          t *= -1;
          if (t === -1) {
            return node.x + 40;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12;
          }
          return node.x - 15;
        } else if (numberOfNodes < 11 && numberOfNodes > 9) {
          t *= -1;
          if (t === -1) {
            return node.x + 50;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12;
          }
          return node.x - 25;
        } else if (numberOfNodes < 9 && numberOfNodes > 7) {
          t *= -1;
          if (t === -1) {
            return node.x + 60;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12;
          }
          return node.x - 38;
        } else if (numberOfNodes < 7 && numberOfNodes > 5) {
          t *= -1;
          if (t === -1) {
            return node.x + 77;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12;
          }
          return node.x - 55;
        } else if (numberOfNodes < 5 && numberOfNodes > 3) {
          t *= -1;
          if (t === -1) {
            return node.x + 110;
          }
          if (x === 0) {
            x += 1;
            return node.x + 20 - 9;
          }
          return node.x - 88;
        } else if (numberOfNodes < 3) {
          t *= -1;
          if (t === -1) {
            return node.x + 210;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12;
          }
          return node.x - 188;
        }
      })
      .attr("r", 4)
      .style("fill", "white")
      .transition()
      .duration(4000)
      .delay((node) => node.depth * 300)
      .attr("opacity", 1);

    svg
      .append("svg:defs")
      .selectAll("marker")
      .data(["end"]) // Different link/path types can be defined here
      .enter()
      .append("svg:marker") // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .style("fill", "red")

      .attr("stroke", "red")
      .attr("d", "M0,-5L10,0L0,5")
      .transition()
      .duration(4000);
    // links

    const enteringAndUpdatingRightLinks = svg
      .selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("marker-end", "url(#end)")
      .attr("class", "link")
      .attr("d", rightlinkGenerator)
      .attr("stroke-dasharray", function () {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .data(root.links())
      .attr("stroke", "red")
      .attr("fill", "none")
      .attr("opacity", 1);

    if (data !== previouslyRenderedData) {
      enteringAndUpdatingRightLinks
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(4000)
        .delay((link) => link.source.depth * 500)
        .attr("stroke-dashoffset", 0);
    }
    k = -1; // for x
    i = -1; // for x
    x = 0; //initial for x
    y = 0; // initial for y
    t = -1; // for y
    let index = 0;
    // labels
    svg
      .selectAll(".label")
      .data(root.descendants())
      .join((enter) => enter.append("text").attr("opacity", 0))
      .attr("class", "label")
      .attr("x", (node) => {
        if (numberOfNodes < 29) {
          k *= -1;
          if (i === -1 || i === 0) {
            i += 1;
          }
          // left side
          if (k === -1) {
            return node.y + 750 * k - 25;
          }
          if (y === 0) {
            y += 1;
            return node.y + 250;
          }
          // right side
          return node.y + 400 * k - i * 150 + 20;
        }
      })
      .attr("y", (node) => {
        if (numberOfNodes < 29 && numberOfNodes > 25) {
          t *= -1;
          if (t === -1) {
            return node.x + 24 - 4;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12 - 9;
          }
          return node.x - 10;
        } else if (numberOfNodes < 25 && numberOfNodes > 21) {
          t *= -1;
          if (t === -1) {
            return node.x + 24 - 4;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12 - 9;
          }
          return node.x - 6;
        } else if (numberOfNodes < 15 && numberOfNodes > 11) {
          t *= -1;
          if (t === -1) {
            return node.x + 30;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12 - 9;
          }
          return node.x - 25;
        } else if (numberOfNodes < 11 && numberOfNodes > 9) {
          t *= -1;
          if (t === -1) {
            return node.x + 40;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12 - 9;
          }
          return node.x - 35;
        } else if (numberOfNodes < 9 && numberOfNodes > 7) {
          t *= -1;
          if (t === -1) {
            return node.x + 50;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12 - 9;
          }
          return node.x - 50;
        } else if (numberOfNodes < 7 && numberOfNodes > 5) {
          t *= -1;
          if (t === -1) {
            return node.x + 65;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12 - 9;
          }
          return node.x - 65;
        } else if (numberOfNodes < 5 && numberOfNodes > 3) {
          t *= -1;
          if (t === -1) {
            return node.x + 100;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12 - 9;
          }
          return node.x - 100;
        } else if (numberOfNodes < 21 && numberOfNodes > 15) {
          t *= -1;
          if (t === -1) {
            return node.x + 20;
          }
          if (x === 0) {
            x += 1;
            return node.x + 12 - 9;
          }
          return node.x - 20;
        } else if (numberOfNodes < 3) {
          t *= -1;
          if (t === -1) {
            return node.x + 200;
          }
          if (x === 0) {
            x += 1;
            return node.x + 4;
          }
          return node.x - 200;
        }
      })
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .text((node) => {
        if (index % 2 == 0) {
          index += 1;
          if (node.data.precedence !== undefined) {
            return `${node.data.precedence}  ---->    ${node.data.resname}`;
          } else if (node.data.count !== undefined) {
            return `${node.data.count}  <----    ${node.data.resname}`;
          }
          return node.data.resname;
        }
        index += 1;
        if (node.data.precedence !== undefined) {
          return `${node.data.resname}    ---->   ${node.data.precedence}`;
        } else if (node.data.count !== undefined) {
          return `${node.data.resname}    ---->   ${node.data.count}`;
        }
        return node.data.resname;
      })
      .style("fill", "white")
      .transition()
      .duration(4000)
      .delay((node) => node.depth * 300)
      .attr("opacity", 1);
  }, [data, dimensions, previouslyRenderedData]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef} className={classes.svg}></svg>
    </div>
  );
}

export default TreeChart;
