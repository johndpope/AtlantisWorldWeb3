import React from 'react'
import Carditem from './Carditem'
import './Cards.css'
import image2 from '../images/big1.png'
//import image1 from '../images/img-1.jpg'
import image3 from '../images/small1.png'
import image4 from '../images/small4.png'
import image8 from '../images/small3.png'
import image9 from '../images/big2.png'

function Cards() {
    return (
        <div className='cards'>
          <h1>Check out these EPIC Virtual World!</h1>
          <div className='cards__container'>
            <div className='cards__wrapper'>
              <ul className='cards__items'>
                <Carditem
                  src={image9}
                  text='Deposit collateral and interest with the combination of defi + web3.'
                  label='Luxury'
                  path='/services'
                />
                <Carditem
                  src= {image2}
                  text='True friends are like diamonds – bright, beautiful, valuable, and always in style.'
                  label='Luxury'
                  path='/services'
                />
              </ul>
              <ul className='cards__items'>
                <Carditem
                  src={image3}
                  text='Diamonds never leave you...'
                  label='Luxury'
                  path='/services'
                />
                <Carditem
                  src={image4}
                  text='Life keeps throwing me stones. And I keep finding the diamonds...'
                  label='Luxury'
                  path='/products'
                />
                <Carditem
                  src={image8}
                  text='Let us not be too particular; it is better to have old secondhand diamonds than none at all'
                  label='Luxury'
                  path='/products'
                />
              </ul>
            </div>
          </div>
        </div>
      );
}

export default Cards;
