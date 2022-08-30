export default (item)=>{
    return new Promise(async (resolve, reject) => {
        let out = (obj)=>{
            resolve(obj)
        }
        let err = (obj)=>{
            reject(obj)
        }
        if(item === undefined){
            out(`
<form action="" id="object-form">
   <div class="form-group">
    <select class  ="form-control search_input_city" id="city" name="plan">
            <option value="0">Неизвестный</option>
            <option value="1">Москва</option>
            <option value="2">Санкт-Петербург</option>
    </select>
    </div>
    <div class="form-group">
    <label for="name" class="control-label">Застройщик<span class="text-danger">*</span></label>
    <input type="text" name="name" class="form-control" id="name" value="">
    </div>
    <div class="form-group">
    <label for="object" class="control-label">Объект<span class="text-danger">*</span></label>
    <input type="text" name="object" class="form-control" id="object" value="">
    </div>
    <div class="form-group">
    <label for="dateExperiences" class="control-label">Срок Сдачи <span class="text-danger">*</span></label>
<input type="text" name="dateExperiences" id="dateExperiences" class="form-control js-transition" value=""/>
    </div>
    <div class="form-group">
    <label for="anons" class="control-label">Класс жилья</label>
<textarea style="resize: vertical;" class="form-control" name="class" rows="2" ></textarea>
    </div>
    <div class="form-group">
    <label for="anons" class="control-label">Тип жилья</label>
<textarea style="resize: vertical;" class="form-control" name="type" rows="2"></textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">Метро</label>
    <textarea style="resize: vertical;" class="form-control" name="metro" rows="2"></textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">ГЕО</label>
    <textarea style="resize: vertical;" class="form-control" name="geo" rows="2"></textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">Планироки</label>
    <textarea style="resize: vertical;" class="form-control" name="plans" rows="2"></textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">Цена от</label>
<textarea style="resize: vertical;" class="form-control" name="price" rows="2"></textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">Отделка</label>
    <textarea style="resize: vertical;" class="form-control" name="finish" rows="2"></textarea>
</div>
<div class="form-group">
    <label for="description" class="control-label">Дополнительная информация</label>
    <textarea class="form-control ckeditor" id="description" name="description" rows="3"></textarea>
</div>
<div class="form-group">
<form id="file-upload-form" class="uploader" >
  <input id="file-upload" type="file"  name="fileUpload" accept="image/*" style="display: none" />
  <label for="file-upload" id="file-drag">
    <div id="start">
      <span id="file-upload-btn" class="btn btn-primary">Добавить изображение</span>
    </div>
    <div id="response" class="hidden">
      <div id="messages"></div>
      <progress class="progress" id="file-progress" value="0">
        <span>0</span>%
      </progress>
    </div>
  </label>
</form>
</div>
</div>
<button type="button" name="save_page_form"  class="btn btn-success">Сохранить</button>
    </form>
`)
        }else{


            out(`
<form action="" id="object-form">
   <div class="form-group">
    <select class  ="form-control search_input_city" id="city" name="plan">
            <option value="0">Неизвестный</option>
            <option value="1">Москва</option>
            <option value="2">Санкт-Петербург</option>
    </select>
    </div>

    <div class="form-group">
    <label for="name" class="control-label">Застройщик<span class="text-danger">*</span></label>
    <input type="text" name="name" class="form-control" id="name" value= "${item['name']}" />
    </div>
    <div class="form-group">
    <label for="object" class="control-label">Объект<span class="text-danger">*</span></label>
    <input type="text" name="object" class="form-control" id="object" value="${item['object']}">
    </div>
    <div class="form-group">
    <label for="dateExperiences" class="control-label">Срок Сдачи <span class="text-danger">*</span></label>
    <textarea style="resize: vertical;" name="dateExperiences" id="dateExperiences" class="form-control js-transition" >${item['dateExperiences']}</textarea>
    </div>
    <div class="form-group ">
    <label for="anons" class="control-label">Класс жилья</label>
<textarea style="resize: vertical;" class="form-control" name="class" rows="2" >${item['class']}</textarea>
    </div>
    <div class="form-group">
    <label for="anons" class="control-label">Тип жилья</label>
<textarea style="resize: vertical;" class="form-control" name="type" rows="2">${item['type']}</textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">Метро</label>
    <textarea style="resize: vertical;" class="form-control" name="metro" rows="2">${item['metro']}</textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">ГЕО</label>
    <textarea style="resize: vertical;" class="form-control" name="geo" rows="2">${item['geo']}</textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">Планироки</label>
    <textarea style="resize: vertical;" class="form-control" name="plans" rows="2">${item['plans']}</textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">Цена от</label>
<textarea style="resize: vertical;" class="form-control" name="price" rows="2">${item['price']}</textarea>
</div>
<div class="form-group">
    <label for="anons" class="control-label">Отделка</label>
    <textarea style="resize: vertical;" class="form-control" name="finish" rows="2">${item['finish']}</textarea>
</div>
<div class="form-group">
    <label for="description" class="control-label">Дополнительная информация</label>
    <textarea class="form-control ckeditor" id="description" name="description" rows="3">${item['description']}</textarea>
</div>
</div>
<div class="form-group">
<form id="file-upload-form" class="uploader" >
  <input id="file-upload" type="file"  name="fileUpload" accept="image/*" style="display: none" />
  <label for="file-upload" id="file-drag">
    <div id="start">
      <span id="file-upload-btn" class="btn btn-primary">Добавить изображение</span>
    </div>
    <div id="response" class="hidden">
      <div id="messages"></div>
      <progress class="progress" id="file-progress" value="0">
        <span>0</span>%
      </progress>
    </div>
  </label>
</form>
</div>
<button type="button" name="save_page_form"  class="btn btn-success">Сохранить</button>
    </form>
`)
        }


    })
}