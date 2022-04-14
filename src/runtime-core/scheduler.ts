const queue: any[] = [];
let isFlushPending = false;
const P = Promise.resolve();
export function queueJobs (job) {
    if (!queue.includes(job)) queue.push(job);
    queueFlush();
};

export function nextTick (fn) {
    return fn ? P.then(fn) : P;
}

function queueFlush () {
    if (isFlushPending) return;
    isFlushPending = true;
    nextTick(flushJobs);
}

function flushJobs () {    
    isFlushPending = false;
    let job;
    while ((job = queue.shift())) {
        job && job();
    }
}