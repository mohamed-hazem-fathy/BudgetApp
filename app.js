
//Budget Control
var  budgeteController = (function() {
    
        var Expense= function(id,description,value){
            this.id = id;
            this.description =description;
            this.value = value    
            this.percentage = -1;

        };

        Expense.prototype.calcPrecentages = function(totalincome){
            if(totalincome > 0){
                this.percentage = Math.round((this.value / totalincome) * 100);

            }else{
                this.percentage = -1
            }

            
        };

        Expense.prototype.getPercentages = function(){
            return this.percentage;
        }

        var Income = function(id,description,value){
            this.id = id;
            this.description =description;
            this.value = value    };

        var CalculateTotal = function(type){
            var sum = 0;
            data.allItems[type].forEach(function(cur) {
                sum += cur.value
            });
            data.totals[type] = sum;
        }

        var data =  {
            allItems: {
                exp:[],
                inc:[]
            },
            totals: {
                exp : 0,
                inc: 0
            },
            badget:0,
            percentage:-1
        };
        return {
            addItem:function(type , des , val){
                var newItem,ID

                //[1 2 3 4 5] , next id =6
                //[1 2 4 6 8], next id  = 9
                //ID = last ID  + 1 

                //Create new ID
                if(data.allItems[type].length > 0) {
                    ID = data.allItems[type][data.allItems[type].length -1].id +1
                }else{
                    ID = 0;
                }
                

                //Create new item based on 'inc' or 'exp' type

                if(type === 'exp') {
                    newItem = new Expense (ID,des,val);
                }else if (type === 'inc') {
                    newItem = new Income (ID,des,val)
                }
                //push it into our data structure
                data.allItems[type].push(newItem);

                return newItem;
            },

            deleteItem: function(type,id){
                var ids,index;

                ids = data.allItems[type].map(function(current) {
                    return current.id
                });

                index = ids.indexOf(id);

                console.log('index = ', index)

                console.log('ids =', ids)

                if(index !== -1) {
                    data.allItems[type].splice(index, 1);

                }
            },

            CalculateBudget: function() {

                //calculate the total income and expenses
                CalculateTotal('exp');
                CalculateTotal('inc');

                //Calcluate the Badgete: income - expenses
                data.badget = data.totals.inc - data.totals.exp;

                //calcuate the percentage of income that we spent
                if(data.totals.inc > 0) {
                    data.percentage =Math.round((data.totals.exp / data .totals.inc) * 100);
                }else{
                    data.percentage = -1;
                }
                

                //Expense = 100 and income 300, spent 33.333% = 00/100 = 0.3333 *100

            },

            calculatePercentages : function(){

                data.allItems.exp.forEach(function(cur){
                    cur.calcPrecentages(data.totals.inc)
                });
            },

            getPercentages: function(){
                var allPerc= data.allItems.exp.map(function(cur){
                    return cur.getPercentages();
                });
                return allPerc;
            },
            getbudget:function() {
                return {
                    budget: data.badget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage :data.percentage
                };  



            },
            testing:function(){
                console.log(data)
            }


        };

 })();


 //UI CONTROLLER
var UIcontroller = (function(){

    var Domstrings = {
        inputType:'.add__type',
        inputDescraption:'.add__description',
        inputValue:'.add__value',
        inputbutton:'.add__btn',
        IncomeContainer:'.income__list',
        ExpenseContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:".budget__income--value",
        expensesLabel:'.budget__expenses--value',
        percemtageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercentLabel:'.item__percentage',
        dateLabel : ".budget__title--month"



    };
    var formatNumber =  function(num, type){

        var numSplit,int,dec,type

        num = Math.abs(num)
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0, int.length -3) + ',' + int.substr(int.length - 3,3);

        }

        dec = numSplit[1];

        type === 'exp' ? sign = '-' : sign = '+';

        return (type === 'exp' ? '-':'+') + ' ' + int + '.' + dec;

    }; 
    var nodeListForEach = function(list , callback) {
        for (var i = 0; i< list.length; i++){
            callback(list[i], i);
        }

    };

    return{
        getInput: function() {
            return{
                type:document.querySelector(Domstrings.inputType).value,
                description : document.querySelector(Domstrings.inputDescraption).value,
                value:parseFloat(document.querySelector(Domstrings.inputValue).value)
            };
        },

        addlistitem:function(obj,type) {
            var html, nweHTML,element
            //Creat HTML string with placeholder text
            if(type === 'inc') {
                element = Domstrings.IncomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div> </div>'

            }else if (type === 'exp') {
                element = Domstrings.ExpenseContainer
                html =  '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div>'

            }   
            
            //Replace the placeholder text with some actual data
            nweHTML = html.replace('%id%', obj.id);
            nweHTML = nweHTML.replace('%description%', obj.description);
            nweHTML = nweHTML.replace('%value%',formatNumber( obj.value, type));


            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', nweHTML);
        },


        deletelistitem: function (selctorID) {
           var el =  document.getElementById(selctorID);
           el.parentNode.removeChild(el);

        },



        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(Domstrings.inputDescraption + ',' + Domstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
                
            });

            fieldsArr[0].focus()
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(Domstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(Domstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');        
            document.querySelector(Domstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp ');        
            if(obj.percentage > 0) {
                document.querySelector(Domstrings.percemtageLabel).textContent = obj.percentage + '%';

            }else {
                document.querySelector(Domstrings.percemtageLabel).textContent = '---';

            }        
          
        },
        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(Domstrings.expensesPercentLabel);


           

            nodeListForEach(fields, function(current , index) {
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%'
                }else {
                    current.textContent = '---';
                }
                

            });
        },


        displayMonth : function() {
            var now, months,month,year;

            now = new Date();

            //var chrisymas = new Date (2023 , 10 , 24)

            months = ['January', 'February', 'March', 'April', 'May' ,'June', 'July','Augest','September','October','November','December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(Domstrings.dateLabel).textContent = months[month]+ ' ' + year

        },

        changedType:function(){

            var fields = document.querySelectorAll(
                Domstrings.inputType + ',' +
                Domstrings.inputDescraption + ',' +
                Domstrings.inputValue);
               

                nodeListForEach(fields, function(cur) {
                    cur.classList.toggle('red-focus');
                });

                document.querySelector(Domstrings.inputbutton).classList.toggle('red');



            
        },

       

        getDomstrang:function(){
            return Domstrings;
        }
    }

})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl,UICtrl) {
    
    var setupeventlistner = function(){
        var Dom = UICtrl.getDomstrang();
        document.querySelector(Dom.inputbutton).addEventListener('click',ctrlAddItem)
        document.addEventListener('keypress',function(event) {
   if ( event.keyCode === 13 || event.which === 13) {
    ctrlAddItem();

   }
  });

   document.querySelector(Dom.container).addEventListener('click',ctrlDleteItem);
   document.querySelector(Dom.inputType).addEventListener('change', UICtrl.changedType)
   
};
    var updateBudget = function() {
        //1. Calculate the budget
        budgetCtrl.CalculateBudget();


        //2. Return the budget
        var budget = budgetCtrl.getbudget();

        //3. Display the badget on the UI
        UICtrl.displayBudget(budget);  
    };

    var updatePercentages = function(){

        //1. Calculate the Percentages
        budgetCtrl.calculatePercentages();
        
        //2. read percentages from the budget Controller
        var percentages = budgetCtrl.getPercentages();

        //3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages)
    }

    var ctrlAddItem = function(){
        var input, newItem;

            //1. Get the field inpuut data
                var input = UICtrl.getInput();
                if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //2. Add the item to the badget controller
                newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            //3. Add,the item to the UI
                UICtrl.addlistitem(newItem,input.type);

            //4. Clear the fields
                UICtrl.clearFields();

            //5. Calculate the UPDAte budget
            updateBudget();

            //6. Calculate and update percentages
            updatePercentages();
            
            

        }

    
    };

    var ctrlDleteItem = function (event) {
        var itemID, splitID, type, ID;

        console.log('event.target.parentNode.parentNode.parentNode  = ', event.target.parentNode.parentNode.parentNode )

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        console.log('itemID = ', itemID)
        

        if(itemID) {


            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1.delete the item from the deta structure
            budgetCtrl.deleteItem(type, ID)

            //2.Delet the Item from the UI
            UICtrl.deletelistitem(itemID);


            //3.update and show the new budget
            updateBudget();
            
             //4. Calculate and update percentages
             updatePercentages();
        }
    }

    return {
        int:function(){
            console.log('your aplcation is start');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage :-1  
            })
            setupeventlistner();
        }
    }

})(budgeteController , UIcontroller);
controller.int();




