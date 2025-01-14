'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../payload/payload-types'

import classes from './index.module.scss'

// Helper function to parse and format price
export const priceFromJSON = (
  priceJSON: string | number, // Allow both string and number types
  quantity: number = 1,
  raw?: boolean,
): string => {
  let price = ''

  if (priceJSON) {
    try {
      if (typeof priceJSON === 'string') {
        // Handle the case where priceJSON is a number
        const priceValue = Number(priceJSON) * quantity

        if (raw) return priceValue.toString()

        price = priceValue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      }
      // else {
      //   // Handle the case where priceJSON is a JSON string
      //   const parsed = JSON.parse(priceJSON)?.data[0];
      //   const priceValue = parsed.unit_amount * quantity;
      //   const priceType = parsed.type;

      //   if (raw) return priceValue.toString();

      //   price = (priceValue / 100).toLocaleString('en-US', {
      //     style: 'currency',
      //     currency: 'USD', // TODO: use `parsed.currency`
      //   });

      //   if (priceType === 'recurring') {
      //     price += `/${
      //       parsed.recurring.interval_count > 1
      //         ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
      //         : parsed.recurring.interval
      //     }`;
      //   }
      // }
    } catch (e) {
      console.error(`Cannot parse priceJSON or handle value`, e) // Updated error message
    }
  }

  return price
}

// Price component
export const Price: React.FC<{
  product: Product
  quantity?: number
  button?: 'addToCart' | 'removeFromCart' | false
}> = props => {
  const { product, product: { priceJSON } = {}, button = 'addToCart', quantity = 1 } = props

  const [price, setPrice] = useState<{
    actualPrice: string
    withQuantity: string
  }>(() => ({
    actualPrice: priceFromJSON(priceJSON, 1),
    withQuantity: priceFromJSON(priceJSON, quantity),
  }))

  useEffect(() => {
    setPrice({
      actualPrice: priceFromJSON(priceJSON, 1),
      withQuantity: priceFromJSON(priceJSON, quantity),
    })
  }, [priceJSON, quantity])

  return (
    <div className={classes.actions}>
      {typeof price?.actualPrice !== 'undefined' && price?.withQuantity !== '' && (
        <div className={classes.price}>
          <p>{price?.withQuantity}</p>
        </div>
      )}
    </div>
  )
}
