import { QRCode } from "../components/QRCode"
import type { Tenant } from "../types"
import './home.css'
const guestFlow = ['Scan QR Code', 'View Menu', 'Add to Cart', 'Place Order', 'Order Confirmed', 'Track Order']


function QRMenuGustFLow({ tenant}: { tenant: Tenant }) {
     const qrUrl = `${window.location.origin}/hotel/${tenant}/menu?table=05`
  return (
    <div>
      <section className="manager-flow manager-panel flow">
                  <div className=" flow"><h2 className="flow">QR Menu - Guest Flow</h2></div>
                  <div className="flow-phones flow">
                    {guestFlow.map((step, index) => (
                      <article className="phone-mock flow" key={step} >
                        <span className="flow">{index + 1}. {step}</span>
                        <div className='flow'>{index === 0 ? <QRCode data={qrUrl} label="Guest flow QR preview" size={86} /> : <strong className="flow">{step}</strong>}</div>
                      </article>
                    ))}
                  </div>
                </section>
    </div>
  )
}

export default QRMenuGustFLow
