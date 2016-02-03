import expect from 'expect';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);

import React, { Component } from 'react';
import {render} from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ScrollArea from '../src/js/scrollArea';
import Scrollbar from '../src/js/scrollBar';

function setupScrollBar(props){
    let renderer = TestUtils.createRenderer();
    renderer.render(<Scrollbar {...props}/>);
    let instance = getRendererComponentInstance(renderer);
    let output = renderer.getRenderOutput();
    let wrapper = output.props.children();

    let content = wrapper.props.children;
    
    return {
        wrapper,
        content,
        renderer,
        output,
        instance
    };
}

function getRendererComponentInstance(renderer){
    return renderer._instance? renderer._instance._instance : null;
}

describe('ScrollBar component', () => {
    it('Vertical should have proper class', () => {
        let {wrapper} = setupScrollBar({type: 'vertical'});
        
        expect(wrapper.props.className).toInclude('vertical');
    });
    
    it('Horizontal should have proper class', () => {
        let {wrapper} = setupScrollBar({type: 'horizontal'});
        
        expect(wrapper.props.className).toInclude('horizontal');
    });
    
    it('ScrollBar should be in proper position', () => {
       let {instance} = setupScrollBar({
           realSize: 400, 
           containerSize: 100, 
           position: -20
       });
                 
       expect(instance.state.position).toBe(5);    
    });
    
    it('ScrollBar should have proper size', () => {
       let { instance } = setupScrollBar({
           realSize: 400, 
           containerSize: 100
       });
           
       expect(instance.state.scrollSize).toBe(25);   
    });
    
    it('Should propagate onMove event after move vertical scrollbar', () => {
        let handleMoveSpy = expect.createSpy();
        let {instance} = setupScrollBar({
           realSize: 400, 
           containerSize: 100,
           onMove: handleMoveSpy
       });
       let mouseDoewnEvent = {clientY: 0, preventDefault: () => {}};
       let moveEvent = {clientY: 25, preventDefault: () => {}};
       instance.handleMouseDown(mouseDoewnEvent);
       instance.handleMouseMoveForVertical(moveEvent);
       
       expect(handleMoveSpy.calls.length).toEqual(1);
       expect(handleMoveSpy.calls[0].arguments).toEqual([-100 , 0]);
    });
    
    it('Should propagate onMove event after move horizontal scrollbar', () => {
        let handleMoveSpy = expect.createSpy();
        let {instance} = setupScrollBar({
           realSize: 400, 
           containerSize: 100,
           onMove: handleMoveSpy,
           type: 'horizontal'
       });
       let mouseDoewnEvent = {clientX: 0, preventDefault: () => {}};
       let moveEvent = {clientX: 25, preventDefault: () => {}};
       instance.handleMouseDown(mouseDoewnEvent);
       instance.handleMouseMoveForHorizontal(moveEvent);
       
       expect(handleMoveSpy.calls.length).toEqual(1);
       expect(handleMoveSpy.calls[0].arguments).toEqual([0, -100]);
    });
    
    it('Should propagate onMove event multiple times', () => {
        let handleMoveSpy = expect.createSpy();
        let {instance} = setupScrollBar({
           realSize: 400, 
           containerSize: 100,
           onMove: handleMoveSpy
       });
       let mouseDoewnEvent = {clientY: 0, preventDefault: () => {}};
       let moveEvent = {clientY: 10, preventDefault: () => {}};
       instance.handleMouseDown(mouseDoewnEvent);
       instance.handleMouseMoveForVertical(moveEvent);
       moveEvent.clientY = 20;
       instance.handleMouseMoveForVertical(moveEvent);
       moveEvent.clientY = 30;
       instance.handleMouseMoveForVertical(moveEvent);
       moveEvent.clientY = 40;
       instance.handleMouseMoveForVertical(moveEvent);
       
       expect(handleMoveSpy.calls.length).toEqual(4);
       expect(handleMoveSpy.calls[3].arguments).toEqual([-40 , 0]);
    });
    
    it('Should be possible to set min scrollbar size', () => {
        let minScrollBarSize = 10;
        let {instance} = setupScrollBar({
            realSize: 10000, 
            containerSize: 100,
            type: 'vertical',
            minScrollSize: minScrollBarSize
        });     
       
        expect(instance.state.scrollSize).toBe(minScrollBarSize);   
    });
    
    it('Calculate percentagePosition should work properly for realSize: 300, containerSize: 100, position: 0', () => {
        let {instance} = setupScrollBar();
        
        expect(instance.calculateFractionalPosition(300, 100, 0)).toEqual(0);
    });
    
    it('Calculate percentagePosition should work properly for realSize: 300, containerSize: 100, position: -200', () => {
        let {instance} = setupScrollBar();
        
        expect(instance.calculateFractionalPosition(300, 100, -200)).toEqual(1);
    });
    
    it('Calculate percentagePosition should work properly for realSize: 300, containerSize: 100, position: -200', () => {
        let {instance} = setupScrollBar();
        
        expect(instance.calculateFractionalPosition(300, 100, -100)).toEqual(0.5);
    });
    
    it('Calculate percentagePosition should work properly for realSize: 160, containerSize: 80, position: -20', () => {
        let {instance} = setupScrollBar();
        
        expect(instance.calculateFractionalPosition(160, 80, -20)).toEqual(0.25);
    });
    
    it('Position of scrollbar should be proper when minScrollBarSize is set', () => {
        let {instance} = setupScrollBar({
            position: -9900, 
            realSize: 10000,
            containerSize: 100,
            type: 'vertical',
            minScrollSize: 10
        });    
        
        expect(instance.state.position).toBe(90);
    });
});