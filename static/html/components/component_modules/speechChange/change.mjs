import  session from '/static/html/components/component_modules/session/session.mjs'
import indexedDB from '/static/html/components/component_modules/indexedDB/indexedDB.mjs'
import templateItem from '/static/html/components/component_modules/tableTemplate/tableTemplate.mjs'
import verify from '/static/html/components/component_modules/tableVerify/tableVerify.mjs'
import listener from '/static/html/components/component_modules/tableListener/tableListener.mjs';

export default (obj, type, ...rest)=>{

    console.assert(false)
    getPagination('#table-id');
    $('#maxRows').trigger('change');
    function getPagination (table){
        $('#maxRows').on('change',function(){
            $('.pagination').html('');						// reset pagination div
            var trnum = 0 ;									// reset tr counter
            var maxRows = parseInt($(this).val());			// get Max Rows from select option

            var totalRows = $(table+' tbody tr').length;		// numbers of rows
            $(table+' tr:gt(0)').each(function(){			// each TR in  table and not the header
                trnum++;									// Start Counter
                if (trnum > maxRows ){						// if tr number gt maxRows
                    $(this).hide();							// fade it out
                }if (trnum <= maxRows ){$(this).show();}// else fade in Important in case if it ..
            });											//  was fade out to fade it in
            if (totalRows > maxRows){						// if tr total rows gt max rows option
                var pagenum = Math.ceil(totalRows/maxRows);	// ceil total(rows/maxrows) to get ..
                //	numbers of pages
                for (var i = 1; i <= pagenum ;){			// for each page append pagination li
                    $('.pagination').append('<li data-page="'+i+'">\
							 	      <span>'+ i++ +'<span class="sr-only"></span></span>\
								    </li>').show();
                }											// end for i
            } 												// end if row count > max rows
            $('.pagination li:first-child').addClass('active'); // add active class to the first li
            //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
            showig_rows_count(maxRows, 1, totalRows);
            //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
            $('.pagination li').on('click',function(e){		// on click each page
                e.preventDefault();
                var pageNum = $(this).attr('data-page');	// get it's number
                var trIndex = 0 ;							// reset tr counter
                $('.pagination li').removeClass('active');	// remove active class from all li
                $(this).addClass('active');					// add active class to the clicked
                //SHOWING ROWS NUMBER OUT OF TOTAL
                showig_rows_count(maxRows, pageNum, totalRows);
                //SHOWING ROWS NUMBER OUT OF TOTAL
                $(table+' tr:gt(0)').each(function(){		// each tr in table not the header
                    trIndex++;								// tr index counter
                    // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
                    if (trIndex > (maxRows*pageNum) || trIndex <= ((maxRows*pageNum)-maxRows)){
                        $(this).hide();
                    }else {
                        this.style.display = ''
                    }
                });
            });
        });
        // end of on select change
        // END OF PAGINATION
    }
// SI SETTING
    $(function(){
        // Just to append id number for each row
        // default_index();
    });
//ROWS SHOWING FUNCTION
    function showig_rows_count(maxRows, pageNum, totalRows) {
        //Default rows showing
        var end_index = maxRows*pageNum;
        var start_index = ((maxRows*pageNum)- maxRows) + parseFloat(1);
        var string = 'Showing '+ start_index + ' to ' + end_index +' of ' + totalRows + ' entries';
        $('.rows_count').html(string);
    }

    function default_index() {
        // $('table tr:eq(0)').prepend('<th class="search_input_id"><input class="search_input_id"type="text" id="search_input_id"  placeholder="id" class="form-control"></th>')
        var id = 0;
        $('table tr:gt(0)').each(function(){
            id++
            $(this).prepend('<td>'+id+'</td>');
        });
    }
    switch (type['type']) {
        case'reset':
            (async (obj, type, rest)=>{
                let itemsObject = await indexedDB['get']({type:'getAll', self: indexedDB})
                let itemSession  = await session['get']({type:'all'})
                for (let m in itemSession) { session['delete']({type: 'item', key: itemSession[m]['id']}) }
                for(let i =0; i < itemsObject.length;i++){
                    let itemObject =  await templateItem(itemsObject[i])
                    session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                }
                let plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                for(let i =0; i < plan.length; i++){

                    await listener['set']({type:'plan', this:plan[i]})
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_id':
            (async (obj, type, rest)=>{ let item = 'id'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'id', id:filter})

                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                // console.assert(false, verifyItem)
                obj.querySelector('tbody').innerHTML = ''
                if(verifyItem){
                    let itemSession  = await session['get']({type:'all'})
                    obj.querySelector('tbody').innerHTML = ''
                    if(itemsObject === undefined){
                        for(let m in itemSession){
                            session['delete']({type:'item', key:itemSession[m]['id']})
                        }
                        $('#maxRows').trigger('change');
                        getPagination('#table-id');
                    }else{
                        for(let m in itemSession){
                            let verify = false
                            if(itemsObject.length > 1){
                                for(let i =0; i < itemsObject.length;i++){
                                    if(itemSession[m]['id'] === itemsObject[i]['id']){
                                        let itemObject =  await templateItem(itemsObject[i])
                                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                    }
                                }
                            }
                            else{
                                if(itemsObject['id'] === itemSession[m]['id']){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject)
                                    session['set']({type:'item', key:`${itemsObject['id']}`, value:JSON.stringify(itemsObject)})
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                                if(verify === false){
                                    session['delete']({type:'item', key:itemSession[m]['id']})
                                }
                            }

                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                    $('#maxRows').trigger('change');
                    getPagination('#table-id');
                }else{
                    obj.querySelector('tbody').innerHTML = ''
                    await verify['clearn']({type:'sessionStorage'})
                    if(itemsObject === undefined){
                        itemsObject = await indexedDB['get']({type:'getAll', self: indexedDB})
                        for(let i =0; i < itemsObject.length;i++){
                            let itemObject =  await templateItem(itemsObject[i])
                        }
                        plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                        for(let i =0; i < plan.length; i++){

                            await listener['set']({type:'plan', this:plan[i]})
                        }
                        $('#maxRows').trigger('change');
                        getPagination('#table-id');
                        // }
                    }else{
                        // console.assert(false, itemsObject, verifyItem)
                        await verify['clearn']({type:'sessionStorage'})
                        // obj.querySelector('tbody').innerHTML = ''
                        if(itemsObject.length >1){
                            for(let i =0; i < itemsObject.length;i++){
                                let itemObject =  await templateItem(itemsObject[i])
                                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                            }
                        }else{

                            let itemObject =  await templateItem(itemsObject)
                            session['set']({type:'item', key:`${itemsObject['id']}`, value:JSON.stringify(itemsObject)})
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                        plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                        for(let i =0; i < plan.length; i++){

                            await listener['set']({type:'plan', this:plan[i]})
                        }
                        $('#maxRows').trigger('change');
                        getPagination('#table-id');
                    }
                }
            })(obj, type, rest)
            break
        case'search_input_City':
            (async (obj, type, rest)=>{
                let item = 'city'
                let input, filter, plan
                let itemsObject = await indexedDB['get']({type:'index', index: `${item}`,filter:type['data'].toLowerCase()})
                filter = type['data'].toLowerCase()

                // console.assert(false, itemsObject)
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                switch (filter) {
                    case '1':
                        filter = 'москва'
                        await verify['set']({type:'sessionStorage', key:item, value: -10})
                        break
                    case '2':
                        filter = 'санкт-петербург'
                        await verify['set']({type:'sessionStorage', key:item, value: -10})
                        break
                    default:
                        filter =  "Все"
                        await verify['set']({type:'sessionStorage', key:item, value: -9})
                        break
                }
                obj.querySelector('tbody').innerHTML = ''

                if(verifyItem){

                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length; i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                        for(let i =0; i < plan.length; i++){

                            await listener['set']({type:'plan', this:plan[i]})
                        }
                    }
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_Developer':
            (async (obj, type, rest)=>{
                let item = 'name'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'name',filter:filter, self: indexedDB})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})

                obj.querySelector('tbody').innerHTML = ''

                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }

                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_Object':
            (async (obj, type, rest)=>{
                let item = 'object'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'object',filter:filter, self: indexedDB})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''
                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }

                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_Deadline':
            (async (obj, type, rest)=>{
                let item = 'dateExperiences'
                let input, filter, plan, table, tr, td, i;
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'dateExperiences',filter:filter, self: indexedDB})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''
                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_houseType':
            (async (obj, type, rest)=>{
                let item = 'type'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                console.assert(false, filter)
                let itemsObject = await indexedDB['get']({type:'index', index: 'type',filter:filter, self: indexedDB})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''
                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }

                $('#maxRows').trigger('change');
                getPagination('#table-id');

            })(obj, type, rest)
            break
        case'search_input_houseClass':
            (async (obj, type, rest)=>{

                let item = 'class'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'class',filter:filter})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''

                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }

                $('#maxRows').trigger('change');
                getPagination('#table-id');


            })(obj, type, rest)
            break
        case'search_input_Metro':
            (async (obj, type, rest)=>{

                let item = 'metro'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'metro',filter:filter, self: indexedDB})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''

                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }

                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_geo':
            (async (obj, type, rest)=>{

                let item = 'geo'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'geo',filter:filter, self: indexedDB})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''
                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_plan':
            (async (obj, type, rest)=>{
                let item = 'plans'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'plans',filter:filter})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''
                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }

                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_price':
            (async (obj, type, rest)=>{
                let item = 'price'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'price',filter:filter, self: indexedDB})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''

                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }

                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_Finish':
            (async (obj, type, rest)=>{
                let item = 'finish'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'finish',filter:filter, self: indexedDB})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''

                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }

                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        case'search_input_AdditionalInfo':
            (async (obj, type, rest)=>{
                let item = 'description'
                let input, filter, plan
                input = type['data'];
                filter = type['data'].toLowerCase();
                let itemsObject = await indexedDB['get']({type:'index', index: 'description',filter:filter, self: indexedDB})
                let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
                obj.querySelector('tbody').innerHTML = ''

                if(verifyItem){
                    let keys =  Object.keys(sessionStorage)
                    for(let i=0; i < keys.length; i++){
                        if(keys[i].split('_').length > 1){
                        }else{
                            let verify = false
                            for(let j =0; j < itemsObject.length; j++){

                                if(itemsObject[j]['id'] === keys[i]){
                                    verify = true
                                    let itemObject =  await templateItem(itemsObject[j])
                                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                }
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }else{
                    await verify['clearn']({type:'sessionStorage'})
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                    plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                    for(let i =0; i < plan.length; i++){

                        await listener['set']({type:'plan', this:plan[i]})
                    }
                }

                $('#maxRows').trigger('change');
                getPagination('#table-id');
            })(obj, type, rest)
            break
        default:
            break

    }
}