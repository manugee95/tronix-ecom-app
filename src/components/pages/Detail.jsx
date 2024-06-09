import { useParams } from "react-router-dom"
import { useContext } from "react"
import EcomContext from "../../context/EcomContext"

function Detail() {
    const params = useParams()
    const carid = params.id
    const {product, addToCart} = useContext(EcomContext)
    const caritem = product.find((item)=> item._id === carid)

  return (
    <div className="flex m-[5%] gap-4">
        <div className="w-[50%]">
            <img src={"http://localhost:3000/"+ caritem?.img} alt="" />
        </div>
        <div className="w-[50%]">
            <h1 className="text-2xl font-bold border-b-2 mb-5">{caritem?.name}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laboriosam dicta officiis iure exercitationem accusantium explicabo magni iste repellat tempora eaque.</p>
            <p className="text-xl font-bold mb-5 mt-5">{caritem?.price}</p>
            <button onClick={()=> addToCart({...caritem, quantity: 1})} className="bg-orange-500 p-[10px] rounded-md">Add to cart</button>
        </div>
    </div>
  )
}

export default Detail