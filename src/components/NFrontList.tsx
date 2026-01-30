import Indice from "./Indice";
// import {AnimatedList} from "@/components/ui/animated-list"
function NFrontList({ items}: { items: any[]}) {
  return (
    <>
    <div className="mt-5 mb-5">
      <div className="h-100 w-100 overflow-y-scroll no-scrollbar">
        {/* <AnimatedList
         scrollDownDuration={scroll}
         columnGap={80}
         
        > */}
        {items.map((s) => (
          <Indice name={s.name} price={s.price} change={String(s.change)} />
        ))}
        {/* </AnimatedList> */}
      </div>
      
    </div>
    </>
  );
}
export default NFrontList;
