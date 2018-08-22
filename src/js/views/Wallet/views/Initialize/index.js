import styled from 'styled-components';
import { H2 } from 'components/Heading';
import Button from 'components/Button';
import P from 'components/P';
import React from 'react';
import { connect } from 'react-redux';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Row = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
`;

const A = styled.a``;

const StyledP = styled(P)`
    margin: 20px 50px;
    display: block;
`;

const Initialize = () => (
    <Wrapper>
        <Row>
            <H2>Your device is in not initialized</H2>
            <StyledP>Please use Bitcoin wallet interface to start initialization process</StyledP>
            <A href="https://wallet.trezor.io/">
                <Button text="Take me to the Bitcoin wallet" />
            </A>
        </Row>
    </Wrapper>
);

export default connect(null, null)(Initialize);
