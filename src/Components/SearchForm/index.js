import createVirtualElement from "@/core/virtualdom"

function SearchForm(){
    return(
        <form className='search'>
            <input className='search__input' placeholder='무엇을 검색하실건가요?'/>
            <button className='search__button'>검색</button>
        </form>
    )

}
export default SearchForm;