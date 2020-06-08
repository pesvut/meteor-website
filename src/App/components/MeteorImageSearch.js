import React, {useEffect} from 'react'
import axios from 'axios';

import Card from '@material-ui/core/Card'
import ImageCarousel from './ImagesCarousel';
import DatePicker from './DatePicker'

const cardStyling = {
  height: "4rem",
  padding: "1rem 2rem", 
  margin: "0.5rem",
  background: "rgb(34, 54, 76)",
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

const MeteorImageSearch = (props) => {
  const [images, setImages] = React.useState([])
  const [selectedDate, handleDateChange] = React.useState(new Date("2020-04-06T02:00:00.000Z"));

  const fetchImages = async () => {
    if (!isValidDate(selectedDate)) return console.log("Non-valid date, skipping fetch");
    const when  = selectedDate.toISOString() 

    const response  = await axios.get(`${window.location.origin}/api/images-by-date?when=${when}&number=`)
    if ( !(response.status==200) ){
      return console.log("ERROR: could not fetch image info: \n", response)
    } else {
      const list = response.data.sort((date1, date2) => Number(date1) - Number(date2))
      setImages(list)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [selectedDate])

  return (
    <div className="root__content">
      <Card style={cardStyling}>
        <DatePicker value={selectedDate} onChange={handleDateChange}/>
      </Card>
      
      <div className="list-of-images">
        <ImageCarousel images={images}/>
      </div>
    </div>
  )
}

export default MeteorImageSearch