var body = $response.body;
var json = JSON.parse(body);

//console.log(body);

var tasks = json.data.userTasks;
var tasks2 = [];
for (var i = 0; i < tasks.length; i++) {
	var task = tasks[i];
	console.log(task.length);

	var task2 = [];
	for (var j = 0; j < task.length; j++) {
		var t = task[j];
		console.log('\t' + (j + 1) + '/' + task.length + ',' + t.taskInfo.taskName);
		if (t.taskFinishStatus != 3) {
			if (t.taskInfo.actionThreshold != 10 || t.canReward && t.taskInfo.actionThreshold == 10) {
				task2.push(t);
			}
			else {
				console.log('過濾不太可能完成的項目');
			}
		}
		else {
			console.log('過濾已領完的項目');
		}
		//console.log(t.taskFinishStatus);
		// if (t.taskInfo.actionKey === 'act_Check_In') {
		//     //t.actionNum = 0;
		//     //t.taskInfo.actionThreshold=1;
		// }
		// t.actionNum = t.taskInfo.actionThreshold;
		// t.actionFinishNum = t.actionNum;
		// // t.taskFinishNum = 1;
		// // t.taskFinishTime = new Date().getTime();
		// //t.taskFinishStatus = 1;
		// t.taskFinishStatus=2;
		// t.taskFinishNum=2;
		// //t.actionFinishNum=2;
	}
	tasks[i] = task2;
	if (task[0].taskInfo.taskName.includes('使用蝦幣')) {
		console.log('過濾使用蝦幣');
	}
	else if (tasks[i].length > 0) {
		tasks2.push(task);
	}

}

json.data.userTasks = tasks2;
body = JSON.stringify(json);

$done({ body });
