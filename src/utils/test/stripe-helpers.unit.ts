import { expect } from 'chai'
import { formatAmountForStripe } from '../stripe-helpers'

describe('#stripeHelpers', () => {
  it('should format dollar amount input into cents for stripe', () => {
    expect(formatAmountForStripe(1.239, 'usd')).to.eq(124)
  })
})
