import { render,fireEvent } from "@testing-library/react"
import Counter from "./counter"

//fireEvent can fake events like clicks and all
//render fakes a render
describe(Counter,()=>{
  
    it("counter displays correct initial count",()=>{
          const {getByTestId}=render(<Counter initialCount={0}/>)
          const countValue=Number(getByTestId("count").textContent);
           expect(countValue).toEqual(0);
    })

    it("Count should incremeant by 1 if the increment button is clicked ",()=>{

        //Here we do a fake render and choose which methods to use
        const {getByTestId,getByRole}=render(<Counter initialCount={0}/>)
        //Gets the button by Role, button or something, the name here indicates what's inside the button comp that we want
        const incrementbutton=getByRole("button",{name:"inc"})
        const countValueBef=Number(getByTestId("count").textContent);
        expect(countValueBef).toEqual(0)
        fireEvent.click(incrementbutton)
        const countValue=Number(getByTestId("count").textContent);
         expect(countValue).toEqual(1);
  })
})