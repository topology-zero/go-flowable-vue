export default () => {
    const key = `Process_${new Date().getTime()}`
    const name = `业务流程_${new Date().getTime()}`
    // const activiti = 'http://activiti.org/bpmn'
    // const camunda = 'http://bpmn.io/schema/bpmn'
    const flowable = 'http://flowable.org/bpmn'

    return `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn2:definitions 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    id="diagram_${key}"
    targetNamespace="${flowable}">
    <bpmn2:process id="${key}" name="${name}" isExecutable="true">
    </bpmn2:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn2:definitions>`
}

