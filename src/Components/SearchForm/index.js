import createVirtualElement from "@/core/virtualdom"

function SearchForm(){
    return(
        <form class='search'>
            <input class='search__input' placeholder='무엇을 검색하실건가요?'/>
            <button class='search__button'>검색</button>
        </form>
    )

}
export default SearchForm;