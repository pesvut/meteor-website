import React from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import {Link as ScrollLink} from 'react-scroll'
import "../assets/css/PageDots.css"

const PageDots = (props) => {
  const [dots, setDots] = React.useState(
    props.pages.map((page, index) => ({...page, isCurrent: (index === 0)}))
  )

  useScrollPosition( ({ prevPos, currPos }) => {
    let yNew = - currPos.y;
    let h = window.innerHeight

    let dottedPage = 0;
    props.pages.forEach((page, index) => {
      if ((index - 0.5)*h < yNew && yNew <= (index + 0.5)*h) dottedPage = index;
    })
    
    if (dots[dottedPage].isCurrent === true) return

    setDots(props.pages.map((page, index) => ({...page, isCurrent: (index === dottedPage) }) ))
  })

  return (
  <div className="side-dot-container">
    {dots.map((dot, index) =>
      <div key={`dot_${index}`}>
        <ScrollLink to={dot.id} smooth={true} duration={500}>
          <div className="side-dot" style={(dot.isCurrent ? {opacity: 1} : {})}>{dot.section}</div>
        </ScrollLink>
      </div>
    )}
  </div>
  )
}

export default PageDots