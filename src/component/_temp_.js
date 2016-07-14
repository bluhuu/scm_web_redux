import { Cascader } from 'antd';

const options = [
  {
  value     : 'zhejiang',
  label     : '浙江',
  children  : [{
                value   : 'hangzhou',
                label   : '杭州',
                children: [{
                            value : 'xihu',
                            label : '西湖',
                          }],
              }],
},
{
  value     : 'jiangsu',
  label     : '江苏',
  children  : [{
                value   : 'nanjing',
                label   : '南京',
                children: [{
                            value : 'zhonghuamen',
                            label : '中华门',
                          }],
              }],
}
];

function onChange(value) {
  console.log(value);
}

// 只展示最后一项
function displayRender(label) {
  return label[label.length - 1];
}

ReactDOM.render(
  <Cascader options={options} expandTrigger="hover" displayRender={displayRender} onChange={onChange} />
, mountNode);



import { Cascader } from 'antd';

const options = [{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖',
      code: 752100,
    }],
  }],
}, {
  value: 'jiangsu',
  label: '江苏',
  children: [{
    value: 'nanjing',
    label: '南京',
    children: [{
      value: 'zhonghuamen',
      label: '中华门',
      code: 453400,
    }],
  }],
}];

function handleAreaClick(e, label, option) {
  e.stopPropagation();
  console.log('点击了', label, option);
}

const displayRender = (labels, selectedOptions) => labels.map((label, i) => {
  const option = selectedOptions[i];
  if (i === labels.length - 1) {
    return (
      <span key={option.value}>
        {label} (<a onClick={(e) => handleAreaClick(e, label, option)}>{option.code}</a>)
      </span>
    );
  }
  return <span key={option.value}>{label} / </span>;
});

ReactDOM.render(
  <Cascader
    options={options}
    defaultValue={['zhejiang', 'hangzhou', 'xihu']}
    displayRender={displayRender}
    style={{ width: 200 }}
  />
, mountNode);


remote.allDocs({
    include_docs: true,
    attachment: true
}).then(functionb (result) {
    var docs = result.rows;
    docs.forEach(function(element) {
        localdb.put(element.doc).then(function(response){
            alert('pulled doc with id' + element.doc._id + 'and added to local db.');}).catch(function (err) {
        if (err.status == 409) {
            localdb.get(element.doc._id).then(function (resp) {
             localdb.remove(resp._id, resp._rev).then(function (resp) {
// et cetera...


remotedb.allDocs(...).then(functioin (resultofAllDocs) {
    return localdb.put(...);
}).then(function (resultOfPut) {
    return localdb.get(...);
}).then(function (resultOfGet) {
    return localdb.put(...);
}).catch(function (err) {
    console.log(err);
});
