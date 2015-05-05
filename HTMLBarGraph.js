/**
 *  NOTE: this javascript class is not being used.
 */

var HTMLBarGraph=new Class({
	Implements:Events,
	initialize:function(element,data,options){
		var me=this;
		me.options=Object.merge({},{
			barWidth:10,
			barHeight:60,
			barTemplate:HTMLBarGraph.DefaultBarTemplate,
			graphTemplate:HTMLBarGraph.DefaultGraphTemplate,
			detailTemplate:HTMLBarGraph.DefaultItemDetailTemplate,
			titleTemplate:HTMLBarGraph.DefaultTitleTemplate,
			classNamePrefix:'BarGraph_',
			title:"Tuesday, Aug. 19th"
			
		},options);
		if(me.options.onAddedBar){
			me.addEvent('onAddedBar',me.options.onAddedBar);
		}
		me.data=[];
		me.element=element;
		me.options.graphTemplate.bind(me)(element);
		me.options.titleTemplate.bind(me)(me.options.title);
		me.maxValue=1;
		if(data&&data.length){
			Object.each(data,function(d){
				if(d.value>me.maxValue)me.maxValue=d.value;
				
			});
	
			Object.each(data,function(d){me.addBar(d);});
			
		}
		me.isLoaded=true;
		
		
	},
	showTitle:function(text){
		var me=this;
		me.options.titleTemplate.bind(me)(text,me.titleEl);
	},
	hideTitle:function(){
		var me=this;
		me.showTitle("", me.titleEl);
	},
	showItemDetails:function(data, element){
		var me=this;
		me.hideItemDetails();
		var dom = me.options.detailTemplate.bind(me)(data, element);
		me.detailsObject=dom;
		me.element.appendChild(dom);
		
	},
	hideItemDetails:function(){
		var me=this;
		if(me.detailsObject){
			
			me.element.removeChild(me.detailsObject);
			me.detailsObject=false;
			
		}
		
		
	},
	addBar:function(data){
		
		var me=this;
		
		if(data.value>me.maxValue)me.setMaxValue(data.value);
		var bar = me.options.barTemplate.bind(me)(data, null);
		me.data.push({data:data, element:bar});
		me.fireEvent('onAddedBar',[data,bar]);
		return me.data.length-1;
		
	},
	updateData:function(index, data){
		var me=this;
		if(me.data.length>index){
			
			Object.each(data, function(v,k){
				me.data[index].data[k]=v;	
			});
			if(data.value&&data.value>me.maxValue){
				me.setMaxValue(data.value);
			}else{
				me.options.barTemplate.bind(me)(me.data[index].data, me.data[index].element);
			}
		}
		
		
	},
	setMaxValue:function(v){
		var me=this;
		me.maxValue=v;
		
		Object.each(me.data,function(d){
			me.options.barTemplate.bind(me)(d.data, d.element);
		});
		
		
	}
	
	
	
	
	
});


HTMLBarGraph.DefaultBarTemplate=function(data, element){
	var me=this;
	if(!element){
	
	var c=new Element('div',{'class':'d_slice'});
	c.setStyle('position','relative');
	var d=new Element('div',{'class':'d_slice_bar'});
	d.setStyle('width','100%');
	
	d.setStyle('position','absolute');
	d.setStyle('bottom','0');
	d.setStyle('left','0');
	c.appendChild(d);
	var i=me.data.length;	
	if(i%2){
		c.addClass('odd');
	}else{
		c.addClass('even');
	}
	me.bar.appendChild(c);

	
	if(data.onHover){
		c.addEvent('mouseover',data.onHover);
	}
	if(data.onClick){
		c.addEvent('click',data.onClick);
	}
	c.addEvent('mouseover',function(){
		me.showItemDetails(data, element);		
	});
	
	
	}else{
		var d=element;
	}
	
	var h=Math.round((data.value/me.maxValue)*100.0);
	d.setStyle('height',h+'%');
	return d;
};
HTMLBarGraph.DefaultGraphTemplate=function(element){
	
	var header=new Element('div');
	header.addClass('details_header');

	
	var l=new Element('span',{style:'float:left','class':"s_left"});
	l.innerHTML="Tuesday, Aug. 19th";
	
	var r=new Element('span',{style:'float:right','class':'s_right'});
	r.innerHTML="Monday, Sep. 8th";

	header.appendChild(l); header.appendChild(r);
	
	var bar=new Element('div');
	element.appendChild(header);
	bar.addClass('details_bar_inner');
	element.appendChild(bar);
	this.bar=bar;
	return bar;
	
};
HTMLBarGraph.DefaultTitleTemplate=function(title, element){
	
	var me=this;
	if(element){
		var titleEl=element;
	}else{
		var titleEl=new Element('div', {'class':'details_title'});
		titleEl.setStyle('position','absolute');
		me.bar.appendChild(titleEl);
	}
	
	titleEl.innerHTML=title;
	me.titleEl=titleEl;
	return titleEl;
};




HTMLBarGraph.DefaultItemDetailTemplate=function(data, element){
	var container=new Element('div');

	var left=new Element('div',{'class':"details_item_details_left"});
	var div=new Element('div',{'class':"details_item_details"});
	div.setStyle('position','absolute');
	div.setStyle('bottom','0');
	div.setStyle('right','0');
	
	
	var number=new Element('div',{'class':"details_item_details_num"});
	number.innerHTML=data.value;
	var title=new Element('div',{'class':"details_item_details_title"});
	var desc=new Element('div',{'class':"details_item_details_desc"});
	
	var c=new Element('div',{'class':"details_item_details_cont"});
	
	title.innerHTML=data.title||data.label||"Oops. no data.";
	desc.innerHTML=data.description||"Oops. no data.";
	
	
	c.appendChild(title);
	if(title.innerHTML!=desc.innerHTML)
		c.appendChild(desc);
	
	div.appendChild(c);
	div.appendChild(number);
	
	left.setStyle('position','absolute');
	left.setStyle('bottom','10px');
	left.setStyle('left','10px');
	left.setStyle('width','0');
	left.setStyle('height','0');
	
	left.appendChild(div);
	container.appendChild(left);
	
	
	
	
	
	if(data.detailsHtml){
	
	var right=new Element('div',{'class':"details_item_layer_right"});
	var div2=new Element('div',{'class':"details_item_layer"});
	div2.setStyle('position','absolute');
	div2.setStyle('bottom','0');
	div2.setStyle('left','0');
	
	
	
	var ldesc=new Element('div2',{'class':"details_item_layer_desc"});
	
	var lc=new Element('div2',{'class':"details_item_layer_cont"});
	
	if(typeOf(data.detailsHtml)=="string"){
		ldesc.innerHTML=data.detailsHtml;
		}
	else{
		ldesc.appendChild(data.detailsHtml);
		
	}
	
		lc.appendChild(ldesc);
	
	div2.appendChild(lc);
	right.setStyle('position','absolute');
	right.setStyle('bottom','10px');
	right.setStyle('right','10px');
	right.setStyle('width','0');
	right.setStyle('height','0');
	
	right.appendChild(div2);
	container.appendChild(right);
	
	
	
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	return container;
};